import { ConvexHttpClient } from "convex/browser";
import { PUBLIC_CONVEX_URL } from "$env/static/public";
import { api } from "../../../convex/_generated/api.js";
import { redirect } from "@sveltejs/kit";
import { type PropertyStatusType } from "../../../convex/getProperties.ts";

// type PropertyStatusType = "for-rent" | "for-sale";

// * @type {import('../../../../.svelte-kit/types/src/routes/properties/[status]/$types.d.ts').PageServerLoad}
export async function load(
  { params }: { params: { status: string } },
) {
  const client = new ConvexHttpClient(PUBLIC_CONVEX_URL!);

  if (!["for-sale", "for-rent"].includes(params.status)) {
    redirect(302, "/properties");
  }

  const status = params.status as PropertyStatusType;

  return {
    status,
    properties: await client.query(api.getProperties.get, {
      status,
    }),
  };
}
