import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': ['error', { considerQueryString: true }],
      'import/first': 1,
      'import/named': 1,
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'none',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

export default eslintConfig;
