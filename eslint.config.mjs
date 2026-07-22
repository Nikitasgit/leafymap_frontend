import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import i18next from "eslint-plugin-i18next";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/features/**/*.{ts,tsx}",
      "src/shared/ui/**/*.{ts,tsx}",
    ],
    plugins: {
      i18next,
    },
    rules: {
      "i18next/no-literal-string": [
        "warn",
        {
          mode: "jsx-text-only",
          "jsx-attributes": {
            exclude: [
              "className",
              "styleName",
              "style",
              "type",
              "name",
              "id",
              "href",
              "src",
              "key",
              "role",
            ],
          },
          callees: {
            exclude: ["t", "i18n.t", "require"],
          },
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "shared", pattern: "shared/*", mode: "folder" },
        {
          type: "feature",
          pattern: "features/*",
          mode: "folder",
          capture: ["feature"],
        },
        { type: "app", pattern: "app/*", mode: "folder" },
        { type: "store", pattern: "store/*", mode: "folder" },
        // App chrome + static assets (not domain layers)
        { type: "chrome", pattern: "components/*", mode: "folder" },
        { type: "chrome", pattern: "assets/*", mode: "folder" },
        { type: "chrome", pattern: "fonts/*", mode: "folder" },
        { type: "chrome", pattern: "types/*", mode: "folder" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: "shared",
              disallow: ["feature", "app"],
              message:
                "shared/ must not import from features/ or app/. Keep the shared kernel independent.",
            },
            {
              from: "feature",
              allow: ["shared", "store", "chrome", "feature"],
            },
            {
              from: "app",
              allow: ["shared", "feature", "store", "chrome"],
            },
            {
              from: "store",
              allow: ["shared", "feature", "chrome", "store"],
            },
            {
              from: "chrome",
              allow: ["shared", "feature", "store", "chrome"],
            },
          ],
        },
      ],
      // Deep imports remain allowed for RSC pages and cycle-breaking (api/model/types/hooks).
      // Prefer public barrels (@/features/<name>) for cross-feature UI when practical.
      "boundaries/entry-point": [
        "error",
        {
          default: "allow",
          rules: [
            {
              target: ["feature"],
              allow: [
                "index.ts",
                "index.tsx",
                "**/index.ts",
                "**/index.tsx",
                "model/**",
                "api/**",
                "types/**",
                "hooks/**",
                "validations/**",
                "utils/**",
                "components/**",
              ],
              message:
                "Import features via their public barrel (@/features/<name>) or an allowed segment (api/model/types/hooks/components/…).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features", "@/features/*", "@/app", "@/app/*"],
              message:
                "shared/ must not import from features/ or app/.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
