<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { API_CREDENTIAL_LOGS_PAGE_SIZE, useApiCredentialLogs } from '@/entities/integration';
import { toIntlLocale } from '@/shared/i18n';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppModal } from '@/shared/ui/app-modal';
import { AppPagination } from '@/shared/ui/app-pagination';
import { AppSkeleton } from '@/shared/ui/app-skeleton';

import { mapLogItemToRecord } from '../lib';

const props = defineProps<{
  credentialId: string;
  /** Production / Development — shown in the title */
  environmentLabel: string;
}>();

const { t, locale } = useI18n({ useScope: 'global' });

const open = ref(false);
const page = ref(1);

// Every opening starts from the latest entries
watch(open, (isOpen) => {
  if (isOpen) page.value = 1;
});

const {
  data: response,
  isLoading,
  isError: isRequestError,
  refetch,
} = useApiCredentialLogs({
  credentialId: () => props.credentialId,
  page,
  enabled: open,
});

// Error state only when there is no data at all: a failed page switch keeps the table
const isError = computed(() => isRequestError.value && !response.value);

const records = computed(() =>
  (response.value?.items ?? []).map((item, index) =>
    mapLogItemToRecord(item, index, toIntlLocale(locale.value)),
  ),
);
const totalCount = computed(() => response.value?.total_count ?? 0);

const COLUMNS = [
  { key: 'createdAt', width: 'w-60' },
  { key: 'action', width: 'flex-1' },
  { key: 'clientIp', width: 'w-40' },
] as const;
</script>

<template>
  <AppButton variant="ghost" size="small" @click="open = true">
    <AppIcon name="file-text-line" class="mr-1.5 size-4" />
    {{ t('integrations.restApiSecrets.logs.action') }}
  </AppButton>

  <AppModal
    v-model:open="open"
    size="lg"
    :title="t('integrations.restApiSecrets.logs.title', { environment: environmentLabel })"
  >
    <div class="flex flex-col gap-4 pb-3">
      <p class="text-sm text-(--text-secondary)">
        {{ t('integrations.restApiSecrets.logs.description') }}
      </p>

      <div v-if="isLoading" class="flex flex-col gap-2">
        <AppSkeleton v-for="row in 5" :key="row" class="h-9 w-full rounded-(--radius-md)" />
      </div>

      <div v-else-if="isError" class="flex flex-col items-center gap-3 py-6 text-center">
        <p class="text-sm font-medium text-(--text-primary)">
          {{ t('integrations.restApiSecrets.logs.error.title') }}
        </p>
        <p class="text-sm text-(--text-secondary)">
          {{ t('integrations.restApiSecrets.logs.error.description') }}
        </p>
        <AppButton variant="outline" size="small" @click="refetch()">
          {{ t('integrations.restApiSecrets.logs.error.retry') }}
        </AppButton>
      </div>

      <div
        v-else-if="records.length === 0"
        class="flex flex-col items-center gap-1 py-6 text-center"
      >
        <p class="text-sm font-medium text-(--text-primary)">
          {{ t('integrations.restApiSecrets.logs.empty.title') }}
        </p>
        <p class="text-sm text-(--text-secondary)">
          {{ t('integrations.restApiSecrets.logs.empty.description') }}
        </p>
      </div>

      <template v-else>
        <div class="w-full overflow-hidden rounded-(--radius-xl) border border-(--border-default)">
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
              {{ t(`integrations.restApiSecrets.logs.columns.${column.key}`) }}
            </div>
          </div>

          <div
            v-for="record in records"
            :key="record.id"
            class="flex w-full items-center border-t border-(--border-default) text-sm text-(--text-primary)"
          >
            <div class="flex h-10 w-60 items-center border-r border-(--border-default) px-4">
              {{ record.createdAt }}
            </div>
            <div
              class="flex h-10 flex-1 items-center truncate border-r border-(--border-default) px-4 font-mono text-xs"
            >
              {{ record.action }}
            </div>
            <div class="flex h-10 w-40 items-center px-4 font-mono text-xs">
              {{ record.clientIp }}
            </div>
          </div>
        </div>

        <AppPagination
          v-if="totalCount > API_CREDENTIAL_LOGS_PAGE_SIZE"
          v-model:page="page"
          :total-items="totalCount"
          :page-size="API_CREDENTIAL_LOGS_PAGE_SIZE"
        />
      </template>
    </div>
  </AppModal>
</template>
