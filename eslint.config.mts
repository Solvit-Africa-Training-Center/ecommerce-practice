import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslintParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      eqeqeq: "error",
      curly: "error",
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      eqeqeq: "error",
      curly: "error",
      semi: ["error", "always"],
      quotes: ["error", "single"],
    },
  },
]);
