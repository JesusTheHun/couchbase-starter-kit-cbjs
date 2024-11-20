/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "insertPragma": false,
  "jsxSingleQuote": false,
  "printWidth": 90,
  "proseWrap": "preserve",
  "quoteProps": "consistent",
  "requirePragma": false,
  "semi": true,
  "singleAttributePerLine": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.5.4',
  importOrder: [
    '^vitest$',
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^src/(.*)$',
    '^tests/(.*)$',
    '^[./]',
  ]
}

export default config;