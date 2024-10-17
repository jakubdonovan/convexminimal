import { mutation } from "./_generated/server";
import { propertyAssetsFields } from "./schema";
import { Infer, v } from "convex/values";

const fileValidator = v.object({
  name: v.string(),
  category: propertyAssetsFields.asset_category,
  description: propertyAssetsFields.description,
});

const assetTypeMapping = {
  brochure: { folder: "documents", assetType: "document" as const },
  floor_plan: { folder: "floor_plans", assetType: "image" as const },
  property_image: { folder: "images", assetType: "image" as const },
  video: { folder: "videos", assetType: "video" as const },
  other: { folder: "other", assetType: "document" as const },
};

function generateAssets(
  propertyId: Infer<typeof propertyAssetsFields.property_id>,
  baseUrl: string,
  files: Infer<typeof fileValidator>[],
  imageName: string,
  imageCount: number,
) {
  const nonImageAssets = files.map((file) => {
    const mapping =
      assetTypeMapping[file.category as keyof typeof assetTypeMapping];
    if (!mapping) {
      throw new Error(`Unknown asset category: ${file.category}`);
    }

    return {
      property_id: propertyId,
      asset_url: `${baseUrl}/${mapping.folder}/${file.name}`,
      asset_type: mapping.assetType,
      asset_category: file.category,
      description: file.description,
      is_primary: false,
    };
  });

  const imageAssets = Array.from({ length: imageCount }, (_, i) => ({
    property_id: propertyId,
    asset_url: `${baseUrl}/images/${imageName}-${i + 1}.jpg`,
    asset_type: "image" as const,
    asset_category: "property_image" as const,
    is_primary: i === 0,
  }));

  return [...nonImageAssets, ...imageAssets];
}

export default mutation({
  args: v.object({
    propertyId: propertyAssetsFields.property_id,
    listingName: v.string(),
    imageName: v.string(),
    files: v.array(fileValidator),
    imageCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const { propertyId, listingName, imageName, files, imageCount } = args;

    try {
      const normalizedPropertyId = ctx.db.normalizeId("properties", propertyId);
      if (!normalizedPropertyId) throw new Error(`Invalid ID: ${propertyId}`);

      const baseUrl = `https://phuketkey.gumlet.io/listings/${listingName}`;

      const assets = generateAssets(
        normalizedPropertyId,
        baseUrl,
        files,
        imageName,
        imageCount,
      );

      await Promise.all(
        assets.map((asset) => ctx.db.insert("property_assets", asset)),
      );

      return { success: true, assetCount: assets.length };
    } catch (error) {
      console.error("Error during property mutation", error);
      throw new Error("Failed to insert data");
    }
  },
});
