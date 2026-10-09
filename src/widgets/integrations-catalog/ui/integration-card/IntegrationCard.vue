<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { Integration } from '@/entities/integration';
import { ConnectionStatusTag, useIntegrationsStore } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';

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
const integrationsStore = useIntegrationsStore();

const iconByType: Record<Integration['type'], string> = {
  'rest-api': restApiIcon,
  s3: s3Icon,
};

const status = computed(() => integrationsStore.getStatus(props.integration.type));

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
        <img :src="iconByType[integration.type]" :alt="integration.name" class="size-7 shrink-0" />

        <p class="truncate text-base font-medium text-(--text-primary)">{{ integration.name }}</p>

        <div class="ml-auto">
          <ConnectionStatusTag :status="status" />
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

    <div class="px-5 py-4">
      <AppButton class="min-w-50.75" @click="goToDetail">
        {{ t('integrations.catalog.connect') }}
      </AppButton>
    </div>
  </article>
</template>
