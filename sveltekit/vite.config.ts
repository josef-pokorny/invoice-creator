import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import circleDependency from "vite-plugin-circular-dependency";

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/lib/paraglide",
            strategy: [
                "cookie",
                "localStorage",
                "url",
                "preferredLanguage",
                "baseLocale",
            ],
        }),
        SvelteKitPWA({
            strategies: "generateSW",
            workbox: {
                maximumFileSizeToCacheInBytes: 20097152,
            },
            manifest: {
                name: "Invoice Creator",
                short_name: "Invoice Creator",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#000000",
                start_url: "/",
                icons: [
                    {
                        src: "/favicon.png",
                        sizes: "256x256",
                        type: "image/png",
                    },
                ],
            },
        }),
        circleDependency({
            outputFilePath: "./circleDep",
            circleImportThrowErr: false,
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
            ignored: ["project.inlang/**", "messages/**"],
        },
    },
    define: {
        "process.env.NODE_ENV": '"production"',
    },
    optimizeDeps: {
        exclude: [
            "skeletonlabs",
            "svelte-pdf",
            "pdfjs-dist",
            "tailwind-variants",
            "tailwind-merge",
        ],
    },
});
