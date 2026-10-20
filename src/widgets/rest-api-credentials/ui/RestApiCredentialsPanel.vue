<script setup lang="ts">
import { computed } from 'vue';

import type { IntegrationType } from '@/entities/integration';
import { CredentialsInfoCard, useRestApiCredentials } from '@/entities/integration';

import { mapCredentialsToClientIdRows } from '../lib';
import ApiSecretsSection from './ApiSecretsSection.vue';

defineProps<{
  integrationType: IntegrationType;
}>();

// WT-357: real client_id per environment; the API secrets list below is still mocked
// until the backend data model is agreed (questions in WT-338)
const { data: credentials } = useRestApiCredentials();

const clientIdRows = computed(() => mapCredentialsToClientIdRows(credentials.value ?? []));
</script>

<template>
  <div class="flex w-full flex-col gap-7">
    <CredentialsInfoCard :rows="clientIdRows" />

    <ApiSecretsSection :integration-type="integrationType" />
  </div>
</template>
