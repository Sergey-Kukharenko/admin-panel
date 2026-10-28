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
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'src/shared/api/generated/**']),

  // ✅ Vue базовые правила
  ...pluginVue.configs['flat/essential'],

  // ✅ Accessibility in templates
  ...pluginVueA11y.configs['flat/recommended'],

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

      // A <label> is tied to its field by for/id OR wraps it; by default the rule requires both
      'vuejs-accessibility/label-has-for': [
        'error',
        // radix-vue CheckboxRoot renders <button role="checkbox">, a form field
        { required: { some: ['nesting', 'id'] }, controlComponents: ['CheckboxRoot'] },
      ],

      // авто-сортировка imports
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // удаление неиспользуемых
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // =========================
      // 🟢 VUE BEST PRACTICES
      // =========================

      // In templates use emit from defineEmits, not $emit: typed events, one style
      'vue/no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='$emit']",
          message: 'Use emit() from defineEmits instead of $emit().',
        },
      ],

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

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },

  // ❗ Prettier всегда последним
  {
    // TODO: the schedule widget is hidden by PM; its header has a clickable span inside a button
    // (month and calendar collapse) — fix together with the widget's return
    files: ['src/widgets/prediction-processing-schedule/**'],
    rules: {
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off',
    },
  },

  {
    // Types are not exported from SFCs: shared types live in <Component>.types.ts or model/types.ts
    files: ['src/**/*.vue'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportNamedDeclaration',
          message: 'Move exported types to <Component>.types.ts (or model/types.ts).',
        },
      ],
    },
  },

  skipFormatting,
);
