import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      eqeqeq: 'error',
      curly: 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      eqeqeq: 'error',
      curly: 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
);
