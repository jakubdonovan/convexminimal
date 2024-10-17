import { query } from "./_generated/server";
import schema from "./schema.ts";

export const get = query({
  args: {
    slug: schema.tables.properties.validator.fields.slug,
  },
  handler: async (ctx, args) => {
    const property = await ctx.db.query("properties").withIndex(
      "by_slug",
      (q) => q.eq("slug", args.slug),
    ).collect();

    return property;
  },
});
