import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/lib/paraglide",
            strategy: ["url", "baseLocale"],
        }),
        SvelteKitPWA({
            strategies: "generateSW",
            manifest: {
                name: "Invoice Creator",
                short_name: "Invoice",
                display: "standalone",
                theme_color: "#2E6DB4",
                background_color: "black",
                icons: [
                    {
                        src: "/favicon.png",
                        sizes: "256x256",
                        type: "image/png",
                    },
                ],
            },
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
    server: {
        watch: {
            ignored: ["**/project.inlang/**"],
        },
    },
    define: {
        "process.env.NODE_ENV": '"development"',
    },
});
