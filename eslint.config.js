// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'design/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  { files: ['src/scripts/**/*.js'], languageOptions: { globals: globals.browser, sourceType: 'module' } },
  { files: ['scripts/**/*.mjs', '*.config.*'], languageOptions: { globals: globals.node } },
  { files: ['functions/**/*.js'], languageOptions: { globals: globals.serviceworker, sourceType: 'module' } },
  {
    files: ['tests/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.serviceworker }, sourceType: 'module' },
  },
];
