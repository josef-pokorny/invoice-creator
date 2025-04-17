import adapter from "@sveltejs/adapter-static";
import adapterVercel from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapterVercel(),
        serviceWorker: {
            register: false,
        },
    },
    alias: {
        $routes: "./src/routes",
        $types: ".svelte-kit/types/src/routes/$types",
        $static: "./static",
        $src: "./src",
    },
    optimizeDeps: {
        exclude: ["skeletonlabs", "pdfjs-dist"],
    },
};

export default config;
