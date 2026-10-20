<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { Integration } from '@/entities/integration';
import { ConnectionStatusTag, useIntegrationStatus } from '@/entities/integration';
import { FEATURE_INTEGRATION_SECRETS } from '@/shared/config/env';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppSkeleton } from '@/shared/ui/app-skeleton';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import restApiIcon from '../../assets/icons/rest-api.svg';
import s3Icon from '../../assets/icons/s3.svg';

defineOptions({
  name: 'IntegrationCard',
});

const props = defineProps<{
  integration: Integration;
}>();

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

const iconByType: Record<Integration['type'], string> = {
  'rest-api': restApiIcon,
  s3: s3Icon,
};

const {
  data: status,
  isPending: isStatusLoading,
  isError: isStatusRequestError,
  refetch: refetchStatus,
} = useIntegrationStatus(() => props.integration.type);

// Error only when there is no status at all: a failed background poll keeps the shown tag
const isStatusError = computed(() => isStatusRequestError.value && !status.value);

// После заявки повторно подать её нельзя: кнопка неактивна, подсказка объясняет почему
// (решение PM 2026-09-24, тексты предложены в WT-337). Если статус не загрузился, кнопку
// не блокируем — повторную заявку отсечёт бэкенд (409)
const disabledTooltip = computed(() => {
  if (status.value === 'setup_in_progress') {
    return t('integrations.catalog.connectDisabledTooltip.setupInProgress');
  }
  // С флагом экранов secrets (H2) подключённая интеграция открывается — там управление ключами
  if (status.value === 'connected' && !FEATURE_INTEGRATION_SECRETS) {
    return t('integrations.catalog.connectDisabledTooltip.connected');
  }
  return null;
});

function goToDetail() {
  router.push(`/integrations/${props.integration.type}`);
}
</script>

<template>
  <article
    class="flex w-full max-w-91 flex-col justify-between overflow-hidden rounded-2xl"
    style="background-image: linear-gradient(183deg, #ffffff 42%, #efefef 97%)"
  >
    <div class="flex flex-col gap-5 px-5 pt-5">
      <div class="flex items-center gap-1.5">
        <!-- Как в макете (popup icons 52:2123/52:2128): иконка в натуральном размере по центру
             слота 28px, без растягивания — у S3 пропорции не квадратные (33×25) -->
        <span class="flex size-7 shrink-0 items-center justify-center">
          <img :src="iconByType[integration.type]" :alt="integration.name" class="max-w-none" />
        </span>

        <p class="truncate text-base font-medium text-(--text-primary)">{{ integration.name }}</p>

        <div class="ml-auto">
          <AppSkeleton v-if="isStatusLoading" class="h-4 w-24 rounded-(--radius-sm)" />
          <ConnectionStatusTag v-else-if="status" :status="status" />
          <div v-else-if="isStatusError" class="flex items-center gap-1">
            <span
              class="font-mono text-xs font-medium whitespace-nowrap uppercase text-(--text-error)"
            >
              {{ t('integrations.statusError.tag') }}
            </span>
            <AppButton
              variant="ghost"
              size="icon"
              :aria-label="t('integrations.statusError.retry')"
              @click="refetchStatus()"
            >
              <AppIcon name="loop-left-fill" class="size-3.5" />
            </AppButton>
          </div>
        </div>
      </div>

      <p class="text-sm text-(--text-secondary)">
        {{ t(`integrations.items.${integration.i18nKey}.cardDescription`) }}
      </p>
    </div>

    <div class="px-5 pt-5 pb-4">
      <ul class="list-disc space-y-0 pl-3.75 text-[10px] leading-5 text-(--text-secondary)">
        <li v-for="featureKey in integration.featureKeys" :key="featureKey">
          {{ t(`integrations.items.${integration.i18nKey}.features.${featureKey}`) }}
        </li>
      </ul>
    </div>

    <div class="flex px-5 py-4">
      <AppTooltip v-if="disabledTooltip" :icon="false" :text="disabledTooltip">
        <AppButton class="min-w-50.75" disabled>
          {{ t('integrations.catalog.connect') }}
        </AppButton>
      </AppTooltip>

      <AppButton v-else class="min-w-50.75" :disabled="isStatusLoading" @click="goToDetail">
        {{ t('integrations.catalog.connect') }}
      </AppButton>
    </div>
  </article>
</template>
