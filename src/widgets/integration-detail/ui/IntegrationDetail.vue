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
import { RestApiCredentialsPanel } from '@/widgets/rest-api-credentials';
import { S3ConnectionModal } from '@/widgets/s3-connection-modal';
import { S3CredentialsPanel } from '@/widgets/s3-credentials';

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
const isConnected = computed(() => status.value === 'connected');

const isConnectionModalOpen = ref(false);

function requestConnection() {
  isConnectionModalOpen.value = true;
}

function handleConnectionRequestSubmit() {
  isConnectionModalOpen.value = false;
  integrationsStore.requestConnection(props.integration.type);
  toast.success(t('integrations.detail.requestSuccess'));
  router.push('/integrations');
}
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-8">
    <div class="flex items-start justify-between gap-4">
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

    <RestApiCredentialsPanel
      v-if="integration.type === 'rest-api' && isConnected"
      :integration-type="integration.type"
    />

    <S3CredentialsPanel
      v-else-if="integration.type === 's3' && isConnected"
      :integration-type="integration.type"
    />

    <div v-else class="flex flex-1 items-center justify-center">
      <AppEmptyState
        :title="t('integrations.detail.emptyStateTitle')"
        :description="t(`integrations.items.${integration.i18nKey}.emptyStateDescription`)"
        :illustration-src="integration.illustrationSrc"
      >
        <template #action>
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
