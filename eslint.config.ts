import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n';
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

  // ✅ Доступность (a11y) в шаблонах
  ...pluginVueA11y.configs['flat/recommended'],

  {
    // TODO: виджет расписания скрыт PM; в шапке кликабельный span внутри кнопки
    // (месяц и сворачивание календаря) — исправить вместе с возвратом виджета
    files: ['src/widgets/prediction-processing-schedule/**'],
    rules: {
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off',
    },
  },

  // ✅ i18n: видимый текст в шаблонах — только через t()
  {
    files: ['src/**/*.vue'],
    plugins: { '@intlify/vue-i18n': pluginVueI18n },
    rules: {
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          // Знаки, разделители и числа переводить не нужно
          ignorePattern: '^[-–—·•…/|:;,.*+×%#№()\\[\\]\\s\\d]*$',
          // Технические термины и примеры значений не переводятся
          ignoreText: ['CSV', 'API', 'Client ID', 'Access Key ID', 'New_Casino'],
          attributes: { '/.+/': ['aria-label', 'title', 'placeholder', 'alt'] },
        },
      ],
    },
  },

  {
    // TODO: скрытые экраны (профиль, тарифы, расписание) переводим вместе с их возвратом
    files: [
      'src/widgets/profile-overview/**',
      'src/widgets/tariff-limits/**',
      'src/widgets/tariff-usage-chart/**',
      'src/widgets/prediction-processing-schedule/**',
    ],
    rules: { '@intlify/vue-i18n/no-raw-text': 'off' },
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
      // =========================
      // ♿ A11Y
      // =========================

      // В шаблоне — emit из defineEmits, а не $emit (типизированные события, один стиль)
      'vue/no-restricted-syntax': [
        'error',
        { selector: "CallExpression[callee.name='$emit']", message: 'Use emit() from defineEmits instead of $emit().' },
      ],

      // <label> связан с полем через for/id ИЛИ оборачивает его — по умолчанию правило требует оба
      'vuejs-accessibility/label-has-for': [
        'error',
        // CheckboxRoot из radix-vue рендерит <button role="checkbox"> — это поле формы
        { required: { some: ['nesting', 'id'] }, controlComponents: ['CheckboxRoot'] },
      ],

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

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },

  // ❗ Prettier всегда последним
  skipFormatting,
);
