import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["**/dist/**"]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error"
    }
  }
];
