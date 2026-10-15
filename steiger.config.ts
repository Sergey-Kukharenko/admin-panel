import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Тесты лежат рядом с кодом в __tests__ — это не сегмент и не публичный API
    ignores: ['**/__tests__/**'],
  },
  {
    rules: {
      // Ложно срабатывает на виджетах, которые импортируют страницы; совет «слить фичу
      // с единственным потребителем» противоречит нашему критерию feature/widget
      'fsd/insignificant-slice': 'off',
      // Сегменты assets и app/providers закреплены в манифесте
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    // Исходники иконок (src/shared/assets/icons/ui) читает скрипт сборки спрайта
    files: ['./src/shared/assets/**'],
    rules: {
      'fsd/no-reserved-folder-names': 'off',
      'fsd/public-api': 'off',
    },
  },
  {
    // TODO: панели ключей (rest-api-credentials, s3-credentials) переедут внутрь виджета,
    // когда появится API ключей — см. docs/fsd-debt.md
    files: ['./src/widgets/integration-detail/**'],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
]);
