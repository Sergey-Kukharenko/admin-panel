<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { AppIcon } from '@/shared/ui/app-icon';

import ConnectionStatusTag from '../connection-status-tag/ConnectionStatusTag.vue';

defineOptions({
  name: 'CredentialsInfoCard',
});

import type { CredentialsInfoRow } from './CredentialsInfoCard.types';

defineProps<{
  /** Identifier rows: client_id per environment for REST API, Access Key ID for S3 */
  rows: CredentialsInfoRow[];
}>();

const { t } = useI18n({ useScope: 'global' });

async function copyValue(value: string) {
  await navigator.clipboard.writeText(value);
  toast.success(t('integrations.credentials.copied'));
}
</script>

<template>
  <!-- «Общая информация» block of a connected integration (mockups 790:133406, 918:83101) -->
  <section
    class="flex flex-col gap-3 rounded-(--radius-xl) border border-(--border-default) px-2 pt-4 pb-2"
    style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
  >
    <p class="px-2 text-base font-medium text-(--text-primary)">
      {{ t('integrations.credentials.generalInfo') }}
    </p>

    <div class="flex flex-col gap-4 rounded-(--radius-lg) bg-(--bg-surface-primary) p-4">
      <div class="flex items-center gap-4">
        <p class="w-49.5 shrink-0 text-sm text-(--text-primary)">
          {{ t('integrations.credentials.connectionStatus') }}
        </p>
        <ConnectionStatusTag status="connected" />
      </div>

      <template v-for="row in rows" :key="row.label">
        <div class="h-px w-full bg-(--border-default)" />

        <div class="flex items-center gap-4">
          <p class="w-49.5 shrink-0 text-sm font-medium text-(--text-primary)">{{ row.label }}</p>
          <p class="flex-1 text-sm text-(--text-primary)">{{ row.value }}</p>
          <button
            v-if="row.copyable"
            type="button"
            :aria-label="t('integrations.credentials.copyAria', { field: row.label })"
            class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
            @click="copyValue(row.value)"
          >
            <AppIcon name="file-copy-line" class="size-4" />
          </button>
        </div>
      </template>
    </div>
  </section>
</template>
