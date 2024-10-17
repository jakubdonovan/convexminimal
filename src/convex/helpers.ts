import { MutationCtx, QueryCtx } from "./_generated/server";

export const getPropertyRecordById = async (
  ctx: MutationCtx | QueryCtx,
  id: string,
) => {
  const normalizedId = ctx.db.normalizeId("properties", id);
  if (!normalizedId) throw new Error(`Invalid ID: ${id}`);

  const record = await ctx.db
    .query("properties")
    .withIndex("by_id", (q) => q.eq("_id", normalizedId))
    .unique();

  if (!record) throw new Error(`Property with ID "${id}" does not exist.`);

  return record;
};
