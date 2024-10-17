import { query } from "./_generated/server";
import { getManyFrom, getOneFrom } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { Infer, v } from "convex/values";

export const PropertyStatusValidator = v.union(
  v.literal("for-sale"),
  v.literal("for-rent"),
);
export type PropertyStatusType = Infer<typeof PropertyStatusValidator>;

export const get = query({
  args: {
    status: v.optional(PropertyStatusValidator),
    // includeType: v.optional(v.boolean()),
    // includeLocation: v.optional(v.boolean()),
    // includeAmenities: v.optional(v.boolean()),
    // includeAssets: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let propertiesQuery = ctx.db.query("properties");

    // Filter by status (for-sale or for-rent)
    if (args.status) {
      propertiesQuery = propertiesQuery.filter((q) =>
        q.eq(
          q.field(args.status === "for-sale" ? "for_sale" : "for_rent"),
          true,
        )
      );
    }

    const properties = await propertiesQuery.collect();

    // Fetch related data for each property
    return await Promise.all(
      properties.map(async (property) => {
        const propertyType = await getOneFrom(
          ctx.db,
          "property_type_options",
          "by_id",
          property.property_type_id,
          "_id",
        );

        const propertyLocation = await getOneFrom(
          ctx.db,
          "property_locations",
          "by_id",
          property.property_location_id,
          "_id",
        );

        const propertyAmenities = await asyncMap(
          await getManyFrom(
            ctx.db,
            "property_amenities",
            "by_property_id",
            property._id,
          ),
          async (record) => {
            const amenity = await ctx.db.get(record.amenity_id);
            if (!amenity) {
              throw new Error(`Amenity ${record.amenity_id} not found.`);
            }

            return {
              name: amenity.name,
              details: record.details,
            };
          },
        );

        const propertyAssets = await asyncMap(
          await getManyFrom(
            ctx.db,
            "property_assets",
            "by_property_id",
            property._id,
          ),
          async (record) => {
            switch (record.asset_type) {
              case "document":
                return {
                  category: "documents",
                  ...record,
                };
              case "image":
                switch (record.asset_category) {
                  case "property_image":
                    return {
                      category: "images",
                      ...record,
                    };
                  case "floor_plan":
                    return {
                      category: "floor_plans",
                      ...record,
                    };
                  case "brochure":
                    return {
                      category: "documents",
                      ...record,
                    };
                  default:
                    return {
                      category: "images",
                      ...record,
                    };
                }
              case "video":
                return {
                  category: "videos",
                  ...record,
                };
              default:
                throw new Error(`Unknown asset type ${record.asset_type}`);
            }
          },
        );

        type AssetCategory = "documents" | "floor_plans" | "images" | "videos";
        interface GroupedAssets {
          documents: (typeof propertyAssets)[number][];
          floor_plans: (typeof propertyAssets)[number][];
          images: (typeof propertyAssets)[number][];
          videos: (typeof propertyAssets)[number][];
        }
        const groupedAssets: GroupedAssets = propertyAssets.reduce(
          (acc, asset) => {
            const category = asset.category as AssetCategory;
            if (acc[category]) {
              acc[category].push(asset);
            }
            return acc;
          },
          {
            documents: [],
            floor_plans: [],
            images: [],
            videos: [],
          } as GroupedAssets,
        );

        return {
          ...property,
          type: propertyType,
          location: propertyLocation,
          amenities: propertyAmenities,
          assets: groupedAssets,
        };
      }),
    );
  },
});
