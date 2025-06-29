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
        paths: {
            relative: false,
        },
    },
    alias: {
        $routes: "./src/routes",
        $types: ".svelte-kit/types/src/routes/$types",
        $src: "./src",
    },
};

export default config;
