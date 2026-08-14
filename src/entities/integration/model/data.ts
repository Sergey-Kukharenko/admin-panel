import restApiEmptyStateIllustration from '../assets/illustrations/rest-api-empty-state.png';
import type { Integration, IntegrationType } from './types';

export const INTEGRATIONS: Integration[] = [
  {
    type: 'rest-api',
    name: 'REST API',
    cardDescription: 'Программный обмен данными через HTTPS с поддержкой пакетной передачи данных',
    features: [
      'Встраивайте отправку в любые сервисы без доработок',
      'Готовность к реалтайм-обработке',
      'Безопасный обмен через короткоживущие токены',
    ],
    status: 'not_configured',
    recommended: true,
    detail: {
      description: 'Прямая передача данных через HTTP API с поддержкой батч-загрузки и стриминга',
      docsUrl: 'https://docs.mico.team/rest-api',
      emptyStateTitle: 'Интеграция не подключена',
      emptyStateDescription:
        'Для получения доступа к API отправьте запрос на подключение. Команда платформы настроит интеграцию и выдаст учётные данные.',
      ctaLabel: 'Запросить подключение',
      illustrationSrc: restApiEmptyStateIllustration,
    },
  },
  {
    type: 's3',
    name: 'Amazon S3',
    cardDescription: 'Файловый обмен данными через облачное хранилище Amazon S3',
    features: [
      'Экономичная выгрузка больших объёмов данных',
      'Бесшовная интеграция с существующим data lake',
      'Безопасное хранение с шифрованием данных',
    ],
    status: 'not_configured',
    detail: {
      description: 'Файловый обмен данными через облачное хранилище Amazon S3 с поддержкой периодической выгрузки',
      emptyStateTitle: 'Интеграция не подключена',
      emptyStateDescription:
        'Для получения доступа к Amazon S3 отправьте запрос на подключение. Команда платформы настроит интеграцию и выдаст учётные данные.',
      ctaLabel: 'Запросить подключение',
    },
  },
];

export function getIntegrationByType(type: string): Integration | undefined {
  return INTEGRATIONS.find((integration) => integration.type === (type as IntegrationType));
}
