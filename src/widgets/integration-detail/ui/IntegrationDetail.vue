<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type { Integration } from '@/entities/integration';
import { useIntegrationsStore } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';
import { AppIcon } from '@/shared/ui/app-icon';
import { RestApiConnectionModal } from '@/widgets/rest-api-connection-modal';
import { S3ConnectionModal } from '@/widgets/s3-connection-modal';

defineOptions({
  name: 'IntegrationDetail',
});

const props = defineProps<{
  integration: Integration;
}>();

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const integrationsStore = useIntegrationsStore();

const status = computed(() => integrationsStore.getStatus(props.integration.type));

// Экран управления secrets вырезан из Ph-1, поэтому для заявленной/подключённой интеграции
// вместо кнопки заявки показываем её статус — повторную заявку отправить нельзя (бэкенд вернёт 409)
const emptyState = computed(() => {
  const { i18nKey } = props.integration;

  if (status.value === 'pending') {
    return {
      title: t('integrations.detail.pendingTitle'),
      description: t('integrations.status.pendingTooltip'),
      canRequest: false,
    };
  }

  if (status.value === 'connected') {
    return {
      title: t('integrations.detail.connectedTitle'),
      description: t('integrations.detail.connectedDescription'),
      canRequest: false,
    };
  }

  return {
    title: t('integrations.detail.emptyStateTitle'),
    description: t(`integrations.items.${i18nKey}.emptyStateDescription`),
    canRequest: true,
  };
});

const isConnectionModalOpen = ref(false);

function requestConnection() {
  isConnectionModalOpen.value = true;
}

function handleConnectionRequestSubmit() {
  isConnectionModalOpen.value = false;
  integrationsStore.requestConnection(props.integration.type);
  toast.success(t('integrations.detail.requestSuccess'), { duration: 5000 });
  router.push('/integrations');
}
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-8">
    <div class="flex items-end justify-between gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-lg leading-6 font-medium text-(--text-primary)">{{ integration.name }}</p>
        <p class="max-w-132 text-sm text-(--text-secondary)">
          {{ t(`integrations.items.${integration.i18nKey}.description`) }}
        </p>
      </div>

      <a
        v-if="integration.docsUrl"
        :href="integration.docsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex h-9 shrink-0 items-center gap-2 rounded-(--radius-lg) bg-(--muted) px-4 text-element-button font-medium text-(--foreground) hover:bg-(--muted-hover)"
      >
        <AppIcon name="file-text-line" class="size-4" />
        {{ t(`integrations.items.${integration.i18nKey}.docsLabel`) }}
        <AppIcon name="arrow-right-up-line" class="size-4" />
      </a>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <AppEmptyState
        :title="emptyState.title"
        :description="emptyState.description"
        :illustration-src="integration.illustrationSrc"
      >
        <template v-if="emptyState.canRequest" #action>
          <AppButton size="small" @click="requestConnection">
            {{ t('integrations.detail.requestConnection') }}
          </AppButton>
        </template>
      </AppEmptyState>
    </div>

    <RestApiConnectionModal
      v-if="integration.type === 'rest-api'"
      :open="isConnectionModalOpen"
      @close="isConnectionModalOpen = false"
      @submit="handleConnectionRequestSubmit"
    />

    <S3ConnectionModal
      v-else-if="integration.type === 's3'"
      :open="isConnectionModalOpen"
      @close="isConnectionModalOpen = false"
      @submit="handleConnectionRequestSubmit"
    />
  </div>
</template>
