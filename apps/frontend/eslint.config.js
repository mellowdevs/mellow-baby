// apps/frontend/eslint.config.js

import tseslint from 'typescript-eslint';
import angularEslint from '@angular-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // Global configurations
  {
    ignores: ['dist', '.angular', 'node_modules'],
  },
  // TypeScript Files Configuration
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended, ...angularEslint.configs.tsRecommended],
    processor: angularEslint.processors.inlineTemplates,
    plugins: {
      import: importPlugin,
      '@angular-eslint': angularEslint,
    },
    rules: {
      // Our custom strict Angular rules
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // Our custom strict typing rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Our custom import ordering rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  // HTML Template Files Configuration
  {
    files: ['**/*.html'],
    extends: [...angularEslint.configs.templateRecommended],
    rules: {
      // You can add template-specific rules here if needed
    },
  },
  // Prettier configuration must be LAST to override other styling rules
  prettier,
);
