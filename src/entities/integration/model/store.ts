import { defineStore } from 'pinia';
import { reactive } from 'vue';

import type { IntegrationStatus, IntegrationType } from './types';

const INITIAL_STATUSES: Record<IntegrationType, IntegrationStatus> = {
  'rest-api': 'not_configured',
  s3: 'not_configured',
};

export const useIntegrationsStore = defineStore('integrations', () => {
  const statuses = reactive<Record<IntegrationType, IntegrationStatus>>({ ...INITIAL_STATUSES });

  function getStatus(type: IntegrationType) {
    return statuses[type];
  }

  function requestConnection(type: IntegrationType) {
    statuses[type] = 'pending';
  }

  return {
    statuses,
    getStatus,
    requestConnection,
  };
});
