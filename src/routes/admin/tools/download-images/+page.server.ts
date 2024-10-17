import { error } from "@sveltejs/kit";
import type { Actions } from "../../../../../.svelte-kit/types/src/routes/admin/tools/download-images/$types.d.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

const BASE_DIR = "src/lib/listing_downloads";

async function fetchPage(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      `Error fetching ${url}: ${response.status} - ${await response.text()}`,
    );
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return await response.text();
}

// image srcs
function extractImageSrcs(html: string) {
  const sanitizedHtml = html.replace(
    /<(style|script)[^>]*>[\s\S]*?<\/\1>/gim,
    "",
  );

  const dom = new DOMParser().parseFromString(sanitizedHtml, "text/html");

  const owlDemoEl = dom.querySelector("#owl-demo");
  const owlDemoFloorEl = dom.querySelector(
    "#owl-demo-floor",
  );
  if (!owlDemoEl || !owlDemoFloorEl) return { images: [], floorPlans: [] };

  const images = [
    ...new Set(
      [...owlDemoEl.querySelectorAll("img")].map((img) => img.src // getAttribute("src")
      ),
    ),
  ];
  const floorPlans = [
    ...owlDemoFloorEl.querySelectorAll("img"),
  ].map(
    (img) => ({
      url: img.getAttribute("src"),
      filename: `${
        img.getAttribute("alt")?.toLowerCase().replace(/\s+/g, "-")
      }.jpg`,
    }),
  );

  return {
    images,
    floorPlans,
  };
}

function getListingName(url: string): string {
  const urlParts = new URL(url).pathname.split("/");

  if (urlParts.length < 2) return "unknown-listing"; // Fallback if the URL is malformed

  return (
    urlParts[urlParts.length - 2]
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "") || "unknown-listing"
  );
}

function generateFilename(
  propertyName: string,
  index: number,
  extension: string,
): string {
  return `${propertyName}-${index + 1}.${extension}`.toLowerCase();
}

async function downloadImage(url: string, outputPath: string) {
  try {
    // Ensure the directory exists
    await Deno.mkdir(outputPath.replace(/\/[^\/]+$/, ""), { recursive: true });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    await Deno.writeFile(outputPath, buffer);

    console.log(
      `Downloaded: ${outputPath.split("/").pop()} to ${outputPath}`,
    );
  } catch (error) {
    console.error(
      `Error downloading ${url}: ${
        error instanceof Error ? error.message : error
      }`,
    );
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const listingUrl = data.get("listingUrl");

    if (typeof listingUrl !== "string") throw error(400, "Invalid URL");

    try {
      const listingName = getListingName(listingUrl);
      const outputDir = `${BASE_DIR}/${listingName}`;
      const imagesDir = `${outputDir}/images`;
      const floorPlansDir = `${outputDir}/floor-plans`;

      const html = await fetchPage(listingUrl);
      const { images, floorPlans } = extractImageSrcs(html);

      const downloadPromises = [
        ...images.map((src, i) => {
          const extension = src.split(".").pop();
          const filename = generateFilename(
            listingName,
            i,
            extension,
          );

          return downloadImage(src, `${imagesDir}/${filename}`);
        }),
        ...floorPlans.map(({ url, filename }) =>
          downloadImage(url, `${floorPlansDir}/${filename.toLowerCase()}`)
        ),
      ];

      await Promise.all(downloadPromises);

      return {
        success: true,
        message: "Images and floor plans downloaded successfully",
        listingName,
        imageCount: images.length,
        floorPlanCount: floorPlans.length,
      };
    } catch (err) {
      console.error("Error downloading images:", err);
      throw error(
        500,
        err instanceof Error
          ? err.message
          : "An unknown error occurred while downloading images",
      );
    }
  },
};
