const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // TypeScript performs its own undefined-symbol checking.
      'no-undef': 'off',
      // The code interfaces with untyped libraries (pushbullet, Dropbox result).
      '@typescript-eslint/no-explicit-any': 'off',
      // pushbullet is a CommonJS module consumed via `import = require`.
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
);
