import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const eslintConfig = tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  plugins: {
    import: importPlugin,
    'unused-imports': unusedImports,
  },
  rules: {
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
});

export default eslintConfig;
