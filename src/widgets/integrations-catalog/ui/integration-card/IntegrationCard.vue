<script setup lang="ts">
import { computed } from 'vue';
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

      <p class="text-sm text-(--text-secondary)">{{ integration.cardDescription }}</p>
    </div>

    <div class="px-5 pt-5 pb-4">
      <ul class="list-disc space-y-0 pl-3.75 text-[10px] leading-5 text-(--text-secondary)">
        <li v-for="feature in integration.features" :key="feature">{{ feature }}</li>
      </ul>
    </div>

    <div class="flex items-center gap-3 px-5 py-4">
      <span
        v-if="integration.recommended"
        class="inline-flex h-5.75 items-center rounded-full bg-(--bg-badge-success) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-success-alt)"
      >
        рекомендуется
      </span>

      <AppButton class="ml-auto" @click="goToDetail">Настроить</AppButton>
    </div>
  </article>
</template>
