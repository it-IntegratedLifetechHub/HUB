import js from "@eslint/js";
import globals from "globals";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ["dist", "node_modules", "*.config.js"] },

  // Base JS configuration
  js.configs.recommended,

  // React configuration
  {
    files: ["**/*.{js,jsx}"],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
        jsxPragma: "React",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactRecommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React specific rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off", // Not needed with React 17+

      // Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Refresh rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Enhanced base rules
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      quotes: ["error", "single", { avoidEscape: true }],
      semi: ["error", "always"],

      // Import rules
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },
  },

  // Additional configuration for test files
  {
    files: ["**/*.test.{js,jsx}"],
    env: {
      jest: true,
    },
    rules: {
      "no-unused-vars": "off",
    },
  },
];
