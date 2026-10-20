<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type {
  Integration,
  IntegrationConnectionRequest,
  RestApiConnectionRequest,
  S3ConnectionRequest,
} from '@/entities/integration';
import {
  integrationKeys,
  useIntegrationStatus,
  useRequestIntegrationConnection,
} from '@/entities/integration';
import { getHttpStatus } from '@/shared/api';
import { FEATURE_INTEGRATION_SECRETS } from '@/shared/config/env';
import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';
import { AppIcon } from '@/shared/ui/app-icon';
import { RestApiConnectionModal } from '@/widgets/rest-api-connection-modal';
import { RestApiCredentialsPanel } from '@/widgets/rest-api-credentials';
import { S3ConnectionModal } from '@/widgets/s3-connection-modal';
import { S3CredentialsPanel } from '@/widgets/s3-credentials';

import IntegrationDetailErrorState from './IntegrationDetailErrorState.vue';

defineOptions({
  name: 'IntegrationDetail',
});

const props = defineProps<{
  integration: Integration;
}>();

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const queryClient = useQueryClient();

const {
  data: status,
  isPending: isStatusLoading,
  isError: isStatusRequestError,
  refetch: refetchStatus,
} = useIntegrationStatus(() => props.integration.type);

// Error only when there is no status at all; otherwise the empty state would claim
// «Интеграция не подключена» for an integration that may well be connected
const isStatusError = computed(() => isStatusRequestError.value && !status.value);
// Экраны управления ключами (H2, WT-345–353) — только за фича-флагом, на моках
const showCredentialsPanel = computed(
  () => FEATURE_INTEGRATION_SECRETS && status.value === 'connected',
);

const { mutate: requestIntegrationConnection, isPending: isSubmitting } =
  useRequestIntegrationConnection();

// Экран управления secrets вырезан из Ph-1, поэтому для заявленной/подключённой интеграции
// вместо кнопки заявки показываем её статус — повторную заявку отправить нельзя (бэкенд вернёт 409)
const emptyState = computed(() => {
  const { i18nKey } = props.integration;

  if (status.value === 'setup_in_progress') {
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

function submitConnectionRequest(request: IntegrationConnectionRequest) {
  requestIntegrationConnection(request, {
    onSuccess: () => {
      isConnectionModalOpen.value = false;
      toast.success(t('integrations.detail.requestSuccess'), { duration: 5000 });
      router.push('/integrations');
    },
    onError: (error) => {
      // 409 — an active request already exists (e.g. sent from another tab): close the modal and
      // refetch, the page will show «Настройка». Any other error keeps the modal open with the
      // filled form so it can be resent (texts proposed to PM in WT-337)
      if (getHttpStatus(error) === 409) {
        isConnectionModalOpen.value = false;
        toast.error(t('integrations.detail.requestAlreadySent'));
        queryClient.invalidateQueries({ queryKey: integrationKeys.overview(request.type) });
        return;
      }

      toast.error(t('integrations.detail.requestFailed'));
    },
  });
}

function handleRestApiSubmit(payload: RestApiConnectionRequest) {
  submitConnectionRequest({ type: 'rest-api', payload });
}

function handleS3Submit(payload: S3ConnectionRequest) {
  submitConnectionRequest({ type: 's3', payload });
}
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-8">
    <div class="flex items-end justify-between gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-lg leading-6 font-medium text-(--text-primary)">{{ integration.name }}</p>
        <p class="text-sm text-(--text-secondary)" :class="!showCredentialsPanel && 'max-w-132'">
          {{
            t(
              `integrations.items.${integration.i18nKey}.${showCredentialsPanel ? 'connectedDescription' : 'description'}`,
            )
          }}
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
      v-if="showCredentialsPanel && integration.type === 'rest-api'"
      :integration-type="integration.type"
    />

    <S3CredentialsPanel
      v-else-if="showCredentialsPanel && integration.type === 's3'"
      :integration-type="integration.type"
    />

    <!-- Пока статус грузится, пустое состояние не показываем, чтобы не мигала кнопка заявки -->
    <IntegrationDetailErrorState v-else-if="isStatusError" @retry="refetchStatus()" />

    <div v-else-if="!isStatusLoading" class="flex flex-1 items-center justify-center">
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
      :submitting="isSubmitting"
      @close="isConnectionModalOpen = false"
      @submit="handleRestApiSubmit"
    />

    <S3ConnectionModal
      v-else-if="integration.type === 's3'"
      :open="isConnectionModalOpen"
      :submitting="isSubmitting"
      @close="isConnectionModalOpen = false"
      @submit="handleS3Submit"
    />
  </div>
</template>
