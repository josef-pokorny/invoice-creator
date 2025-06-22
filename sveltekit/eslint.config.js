import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import ts from "typescript-eslint";

import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...pluginQuery.configs["flat/recommended"],
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    {
        rules: {
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-self-assign": "off",
        },
    },
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "unused-imports/no-unused-imports": "error",
        },
    },
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: { "no-undef": "off" },
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.ts",
            "**/*.svelte.js",
            "**/*.{js,mjs,cjs,ts,jsx,tsx}",
        ],
        ignores: ["eslint.config.js", "svelte.config.js"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig,
            },
        },
    },
);
