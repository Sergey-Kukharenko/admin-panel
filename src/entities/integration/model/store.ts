import { defineStore } from 'pinia';
import { reactive } from 'vue';

import type { IntegrationEnvironment } from './constants';
import type {
  ApiSecret,
  ApiSecretProductAccess,
  ClientCredentials,
  IntegrationStatus,
  IntegrationType,
} from './types';

// rest-api по умолчанию "подключена", чтобы сразу показать экран управления API secrets;
// чтобы продемонстрировать флоу с самого начала (заявка → настройка → подключено),
// поставьте здесь 'not_configured'.
const INITIAL_STATUSES: Record<IntegrationType, IntegrationStatus> = {
  'rest-api': 'connected',
  s3: 'not_configured',
};

const CLIENT_CREDENTIALS: Record<IntegrationType, ClientCredentials> = {
  'rest-api': { clientId: 'cid_nnjd68rh' },
  s3: { clientId: 'cid_nnjd68rh' },
};

const INITIAL_API_SECRETS: Record<IntegrationType, ApiSecret[]> = {
  'rest-api': [
    {
      id: 'seed-crm-integration',
      name: 'CRM Integration',
      environment: 'production',
      productAccess: [
        {
          productId: 'player-intelligence',
          productName: 'Player Intelligence',
          writeData: true,
          readResults: true,
        },
        {
          productId: 'recommender-system',
          productName: 'Recommender System',
          writeData: true,
          readResults: true,
        },
      ],
      createdAt: '2026-05-20',
      status: 'active',
    },
  ],
  s3: [
    {
      id: 'seed-temp-key',
      name: 'Temp Key',
      environment: 'production',
      productAccess: [],
      createdAt: '2026-05-20',
      status: 'active',
    },
  ],
};

export const useIntegrationsStore = defineStore('integrations', () => {
  const statuses = reactive<Record<IntegrationType, IntegrationStatus>>({ ...INITIAL_STATUSES });

  const apiSecrets = reactive<Record<IntegrationType, ApiSecret[]>>({
    'rest-api': [...INITIAL_API_SECRETS['rest-api']],
    s3: [...INITIAL_API_SECRETS.s3],
  });

  function getStatus(type: IntegrationType) {
    return statuses[type];
  }

  function requestConnection(type: IntegrationType) {
    statuses[type] = 'pending';
  }

  function getClientCredentials(type: IntegrationType) {
    return CLIENT_CREDENTIALS[type];
  }

  function getApiSecrets(type: IntegrationType) {
    return apiSecrets[type];
  }

  function createApiSecret(
    type: IntegrationType,
    payload: {
      name: string;
      environment: IntegrationEnvironment;
      productAccess: ApiSecretProductAccess[];
    },
  ) {
    const secretValue = `sk_${crypto.randomUUID().replace(/-/g, '')}`;

    const secret: ApiSecret = {
      id: crypto.randomUUID(),
      name: payload.name,
      environment: payload.environment,
      productAccess: payload.productAccess,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'active',
    };

    apiSecrets[type] = [secret, ...apiSecrets[type]];

    return { secret, secretValue };
  }

  function revokeApiSecret(type: IntegrationType, secretId: string) {
    const secret = apiSecrets[type].find((item) => item.id === secretId);
    if (secret) secret.status = 'revoked';
  }

  function deactivateApiSecret(type: IntegrationType, secretId: string) {
    const secret = apiSecrets[type].find((item) => item.id === secretId);
    if (secret) secret.status = 'inactive';
  }

  function activateApiSecret(type: IntegrationType, secretId: string) {
    const secret = apiSecrets[type].find((item) => item.id === secretId);
    if (secret) secret.status = 'active';
  }

  return {
    statuses,
    apiSecrets,
    getStatus,
    requestConnection,
    getClientCredentials,
    getApiSecrets,
    createApiSecret,
    revokeApiSecret,
    deactivateApiSecret,
    activateApiSecret,
  };
});
