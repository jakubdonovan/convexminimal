import { mutation } from "./_generated/server.js";
import schema from "./schema.ts";
import { propertyAmenitiesFields, propertyTypeFields } from "./schema.ts";
import { Infer, v } from "convex/values";

const { property_type_id, property_location_id, ...rest } =
  schema.tables.properties.validator.fields;

const propertyDataValidator = v.object(rest);

export default mutation({
  args: {
    propertyData: propertyDataValidator,
    propertyType: propertyTypeFields.name,
    locationData: schema.tables.property_locations.validator,
    amenities: v.array(schema.tables.amenities.validator),
  },
  handler: async (ctx, args) => {
    const { propertyData, propertyType, locationData, amenities } = args;

    const getPropertyTypeId = async (
      name: Infer<typeof propertyTypeFields.name>,
    ) => {
      const record = await ctx.db
        .query("property_type_options")
        .withIndex("by_name", (q) => q.eq("name", name))
        .unique();

      if (!record) throw new Error(`Property type "${name}" does not exist.`);

      return record._id;
    };

    const getAmenityId = async (
      name: Infer<typeof propertyAmenitiesFields.name>,
    ) => {
      const record = await ctx.db
        .query("amenities")
        .withIndex("by_name", (q) => q.eq("name", name))
        .unique();

      if (!record) throw new Error(`Amenity "${name}" does not exist.`);

      return record._id;
    };

    try {
      // Fetch property type and insert location
      const [propertyTypeId, propertyLocationId] = await Promise.all([
        getPropertyTypeId(propertyType),
        ctx.db.insert("property_locations", locationData),
      ]);

      // Insert property
      const propertyId = await ctx.db.insert("properties", {
        ...propertyData,
        property_type_id: propertyTypeId,
        property_location_id: propertyLocationId,
      });

      // Insert related data (features, amenities, views) in parallel
      await Promise.all([
        ...amenities.map((amenity) =>
          getAmenityId(amenity.name).then((amenityId) =>
            ctx.db.insert("property_amenities", {
              property_id: propertyId,
              amenity_id: amenityId,
              details: amenity.details,
            })
          )
        ),
      ]);

      return { propertyId, propertyTypeId, propertyLocationId };
    } catch (error) {
      console.error("Error during property mutation", error);
      throw new Error("Failed to insert property or related data");
    }
  },
});
