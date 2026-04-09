import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Variables
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'no-undef': 'error',
      'no-console': 'off',

      'no-duplicate-imports': 'error',
      'no-empty': 'warn',
      'no-extra-semi': 'warn',
      'no-unreachable': 'error',

      // React specific
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      
      'eqeqeq': ['warn', 'always'],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
])
