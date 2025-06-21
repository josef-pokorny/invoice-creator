import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";
import circleDependency from "vite-plugin-circular-dependency";
import devtoolsJson from "vite-plugin-devtools-json";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
    plugins: [
        devtoolsJson({ uuid: "invoice-creator" }),
        mkcert(),
        tailwindcss(),
        sveltekit(),
        paraglideVitePlugin({
            project: "./src/project.inlang",
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
                    @use "$lib/styles/mixins/_mixins.scss" as *;
                    @use "$lib/styles/mixins/shadows.scss" as *;
                    @reference "$lib/app.css";
                `,
            },
        },
    },
    server: {
        watch: {
            ignored: ["project.inlang/**", "messages/**", "README.md"],
        },
        https: true,
    },
    define: {
        "process.env.NODE_ENV":
            // @ts-expect-error: a
            process.env.NODE_ENV !== "development"
                ? '"production"'
                : "'development'",
    },
    optimizeDeps: {
        exclude: ["skeletonlabs", "svelte-pdf", "pdfjs-dist"],
    },
});
