import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Игнорируем dist
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'], // Линтим TS и TSX
    extends: [
      js.configs.recommended,               // ESLint базовые правила
      tseslint.configs.recommended,         // TypeScript правила
      reactHooks.configs.flat.recommended,  // React hooks правила
      reactRefresh.configs.vite,            // Vite + React Refresh
      prettier,                             // Prettier в конце, чтобы отключить конфликтные правила ESLint
    ],
    plugins: {
      prettier: prettierPlugin,             // Показывает ошибки Prettier через ESLint
    },
    rules: {
      'prettier/prettier': 'error',         // Ошибки форматирования Prettier как ESLint ошибки
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])