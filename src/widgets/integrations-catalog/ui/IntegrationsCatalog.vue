<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { INTEGRATIONS } from '@/entities/integration';

import { IntegrationCard } from './integration-card';

defineOptions({
  name: 'IntegrationsCatalog',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-lg leading-6 font-medium text-(--text-primary)">
        {{ t('integrations.catalog.title') }}
      </p>
      <p class="text-sm whitespace-pre-line text-(--text-secondary)">
        {{ t('integrations.catalog.description') }}
      </p>
    </div>

    <div class="flex flex-wrap gap-6">
      <IntegrationCard
        v-for="integration in INTEGRATIONS"
        :key="integration.type"
        :integration="integration"
      />
    </div>
  </div>
</template>
