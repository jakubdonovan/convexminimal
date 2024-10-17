import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import svg from "@poppanator/sveltekit-svg";

export default defineConfig({
  plugins: [
    sveltekit(),
    deno(),
    svg({
      svgoOptions: {
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false } },
          },
          {
            name: "cleanupIds",
            params: {
              remove: true,
              minify: false,
            },
          },
          // { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
        ],
      },
    }),
  ],
});
