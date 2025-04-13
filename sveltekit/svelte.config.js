import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
    },
    alias: {
        $routes: "./src/routes",
        $types: ".svelte-kit/types/src/routes/$types",
        $static: "./static",
    },
    optimizeDeps: {
        exclude: ["skeletonlabs"],
    },
};

export default config;
