<script setup lang="ts">
import { computed } from 'vue';

import type { IntegrationType } from '@/entities/integration';
import { CredentialsInfoCard, useIntegrationsStore } from '@/entities/integration';

import ApiSecretsSection from './ApiSecretsSection.vue';

defineOptions({
  name: 'RestApiCredentialsPanel',
});

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const integrationsStore = useIntegrationsStore();

const clientId = computed(
  () => integrationsStore.getClientCredentials(props.integrationType).clientId,
);
</script>

<template>
  <div class="flex w-full flex-col gap-7">
    <CredentialsInfoCard id-label="client_id" :id-value="clientId" />

    <ApiSecretsSection :integration-type="integrationType" />
  </div>
</template>
