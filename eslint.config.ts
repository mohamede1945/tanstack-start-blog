import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";
import oxlint from "eslint-plugin-oxlint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  [includeIgnoreFile(gitignorePath), globalIgnores(["**/routeTree.gen.ts"])],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: "19.2.3",
      },
    },
    ...pluginReact.configs.flat.recommended,
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  ...tanstackQuery.configs["flat/recommended"],
  ...tanstackRouter.configs["flat/recommended"],
  ...oxlint.configs["flat/recommended"], // oxlint should be the last one
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
]);
