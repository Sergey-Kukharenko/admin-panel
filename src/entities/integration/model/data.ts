import restApiEmptyStateIllustration from '../assets/illustrations/rest-api-empty-state.png';
import type { Integration, IntegrationType } from './types';

// Тексты карточек и детальной страницы — в локалях `integrations.items.<i18nKey>`
export const INTEGRATIONS: Integration[] = [
  {
    type: 'rest-api',
    name: 'REST API',
    i18nKey: 'restApi',
    featureKeys: ['sendResults', 'errorValidation', 'encryption'],
    docsUrl: 'https://docs.mico.team/rest-api',
    illustrationSrc: restApiEmptyStateIllustration,
  },
  {
    type: 's3',
    name: 'Amazon S3',
    i18nKey: 's3',
    featureKeys: ['largeVolumes', 'existingStorages', 'encryption'],
    docsUrl: 'https://docs.mico.team/s3-guide',
    // В макете S3 та же иллюстрация, что и у REST API
    illustrationSrc: restApiEmptyStateIllustration,
  },
];

export function getIntegrationByType(type: string): Integration | undefined {
  return INTEGRATIONS.find((integration) => integration.type === (type as IntegrationType));
}
