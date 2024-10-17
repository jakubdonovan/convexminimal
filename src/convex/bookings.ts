import { query } from "./_generated/server";
import { v } from "convex/values";
import { getManyFrom } from "convex-helpers/server/relationships";

// export const get = query({
// 	args: { user_id: v.id('users') },
// 	handler: async (ctx, args) => {
// 		const users = await getManyFrom(ctx.db, 'bookings', 'user_id', args.user_id);
// 		return users;
// 	}
// });
