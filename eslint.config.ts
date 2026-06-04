import pluginVitest from '@vitest/eslint-plugin';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import { globalIgnores } from 'eslint/config';
import skipFormatting from 'eslint-config-prettier/flat';
// 🔽 ДОБАВЛЯЕМ
import pluginImport from 'eslint-plugin-import';
import pluginOxlint from 'eslint-plugin-oxlint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginVue from 'eslint-plugin-vue';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  // ✅ Vue базовые правила
  ...pluginVue.configs['flat/essential'],

  // ✅ TypeScript
  vueTsConfigs.recommended,

  // ✅ Vitest
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  // ✅ Oxlint
  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // 🔥 ГЛАВНЫЙ БЛОК С ПРАВИЛАМИ
  {
    plugins: {
      import: pluginImport,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      // =========================
      // 📦 IMPORTS
      // =========================

      // авто-сортировка imports
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // удаление неиспользуемых
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // =========================
      // 🟢 VUE BEST PRACTICES
      // =========================

      // порядок атрибутов
      'vue/attributes-order': 'error',

      // порядок секций
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // перенос атрибутов
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 2,
          multiline: 1,
        },
      ],

      // порядок props/emits
      'vue/order-in-components': 'error',

      // self-closing
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
        },
      ],

      // =========================
      // 🧠 GENERAL
      // =========================

      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },

  // ❗ Prettier всегда последним
  skipFormatting,
);
