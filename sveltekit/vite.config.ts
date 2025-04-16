import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/lib/paraglide",
            strategy: ["url", "baseLocale"],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
                additionalData: `
                    @use "$lib/styles/_mixins.scss" as *;
                    @reference "$lib/app.css";
                `,
            },
        },
    },
});
