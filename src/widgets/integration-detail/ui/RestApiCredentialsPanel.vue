<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { CredentialsInfoCard, useRestApiCredentials } from '@/entities/integration';
import { RotateApiSecretAction } from '@/features/rotate-api-secret';
import { ApiCredentialLogsAction } from '@/features/view-api-credential-logs';
import { AppEmptyState } from '@/shared/ui/app-empty-state';
import { AppIcon } from '@/shared/ui/app-icon';

import { mapCredentialsToRows } from '../lib/credentialRows';

const { t } = useI18n({ useScope: 'global' });

// The backend issues one credential per environment; the mockup's named-keys list is adapted
// to it as agreed with the backend in WT-338 (2026-10-22): a row per environment with rotation
const { data: credentials } = useRestApiCredentials();

const rows = computed(() => mapCredentialsToRows(credentials.value ?? []));

const COLUMNS = [
  { key: 'environment', width: 'w-50' },
  { key: 'clientId', width: 'flex-1' },
  { key: 'actions', width: 'w-80' },
] as const;

async function copyClientId(clientId: string) {
  await navigator.clipboard.writeText(clientId);
  toast.success(t('integrations.credentials.copied'));
}
</script>

<template>
  <div class="flex w-full flex-col gap-7">
    <CredentialsInfoCard :rows="[]" />

    <div class="flex flex-col gap-4">
      <p class="text-base font-medium text-(--text-primary)">
        {{ t('integrations.restApiSecrets.title') }}
      </p>

      <AppEmptyState
        v-if="rows.length === 0"
        :title="t('integrations.restApiSecrets.empty.title')"
        :description="t('integrations.restApiSecrets.empty.description')"
      />

      <div
        v-else
        class="w-full overflow-hidden rounded-(--radius-xl) border border-(--border-default)"
      >
        <div class="flex w-full items-center">
          <div
            v-for="(column, index) in COLUMNS"
            :key="column.key"
            class="flex h-9 items-center bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
            :class="[
              column.width,
              index < COLUMNS.length - 1 && 'border-r border-(--border-default)',
            ]"
          >
            {{ t(`integrations.credentials.columns.${column.key}`) }}
          </div>
        </div>

        <div
          v-for="row in rows"
          :key="row.id"
          class="flex w-full items-center border-t border-(--border-default) text-sm font-medium text-(--text-primary)"
        >
          <div class="flex h-12 w-50 items-center border-r border-(--border-default) px-4">
            {{ row.environmentLabel }}
          </div>
          <div class="flex h-12 flex-1 items-center gap-2 border-r border-(--border-default) px-4">
            <span class="truncate">{{ row.clientId }}</span>
            <button
              type="button"
              :aria-label="t('integrations.credentials.copyAria', { field: 'client_id' })"
              class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
              @click="copyClientId(row.clientId)"
            >
              <AppIcon name="file-copy-line" class="size-4" />
            </button>
          </div>
          <div class="flex h-12 w-80 items-center gap-2 px-4">
            <ApiCredentialLogsAction
              :credential-id="row.id"
              :environment-label="row.environmentLabel"
            />
            <RotateApiSecretAction
              :credential-id="row.id"
              :environment-label="row.environmentLabel"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
