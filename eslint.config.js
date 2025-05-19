import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  js.configs.recommended,
  ts.configs.recommended,
  {
    rules: {
      'prefer-const': 'error',
    },
  },
  eslintConfigPrettier,
]);
