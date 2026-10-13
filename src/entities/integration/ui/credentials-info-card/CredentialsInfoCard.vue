<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { AppIcon } from '@/shared/ui/app-icon';

import ConnectionStatusTag from '../connection-status-tag/ConnectionStatusTag.vue';

defineOptions({
  name: 'CredentialsInfoCard',
});

const props = defineProps<{
  /** Подпись идентификатора: «client_id» у REST API, «Access Key ID» у S3 */
  idLabel: string;
  idValue: string;
}>();

const { t } = useI18n({ useScope: 'global' });

async function copyId() {
  await navigator.clipboard.writeText(props.idValue);
  toast.success(t('integrations.credentials.copied'));
}
</script>

<template>
  <!-- Блок «Общая информация» экрана подключённой интеграции (макеты 790:133406, 918:83101) -->
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

      <div class="h-px w-full bg-(--border-default)" />

      <div class="flex items-center gap-4">
        <p class="w-49.5 shrink-0 text-sm font-medium text-(--text-primary)">{{ idLabel }}</p>
        <p class="flex-1 text-sm text-(--text-primary)">{{ idValue }}</p>
        <button
          type="button"
          :aria-label="t('integrations.credentials.copyAria', { field: idLabel })"
          class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
          @click="copyId"
        >
          <AppIcon name="file-copy-line" class="size-4" />
        </button>
      </div>
    </div>
  </section>
</template>
