// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    files: ["**/*.js", "**/*.svelte"],
    plugins: {
      js,
    },
    extends: ["js/recommended", svelte.configs["flat/recommended"]],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
]);
