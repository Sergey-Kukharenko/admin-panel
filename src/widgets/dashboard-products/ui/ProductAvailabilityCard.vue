<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';

import type { DashboardProduct } from '../model/types';

defineOptions({
  name: 'ProductAvailabilityCard',
});

defineProps<{
  product: DashboardProduct;
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div
    class="relative flex h-47.5 flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-(image:--gradient-card)"
  >
    <div class="flex flex-col gap-2 px-5 pt-5">
      <div class="flex items-center gap-2">
        <p class="text-base font-medium text-(--text-primary)">{{ product.name }}</p>

        <span v-if="product.isActive" class="flex items-center gap-1 text-(--text-success-soft)">
          <AppIcon name="check-alt" class="size-3.5" />
          <span class="text-xs font-medium uppercase">{{ t('dashboard.product.active') }}</span>
        </span>
      </div>

      <p class="w-83 text-body-sm text-(--text-secondary)">{{ product.description }}</p>
    </div>

    <div class="flex items-center gap-3 px-5 py-4">
      <div class="flex flex-col items-center gap-1">
        <p class="font-mono text-xs text-(--text-secondary) uppercase">
          {{ t('dashboard.product.data') }}
        </p>
        <div
          class="flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-neutral) pr-2 pl-1.5"
        >
          <AppIcon name="checkbox-circle-line" class="size-3.5 text-(--text-primary)" />
          <span class="font-mono text-xs font-medium text-(--text-primary) uppercase">
            {{ product.dataStatusLabel }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-start gap-1">
        <p class="font-mono text-xs text-(--text-secondary) uppercase">
          {{ t('dashboard.product.results') }}
        </p>
        <div
          class="flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-neutral) pr-2 pl-1.5"
        >
          <AppIcon name="checkbox-circle-line" class="size-3.5 text-(--text-primary)" />
          <span class="font-mono text-xs font-medium text-(--text-primary) uppercase">
            {{ t('dashboard.product.ready') }}
          </span>
          <span class="text-(--text-secondary)">·</span>
          <span class="font-mono text-xs text-(--text-secondary) uppercase">
            {{ product.resultsDate }}
          </span>
        </div>
      </div>
    </div>

    <img
      :src="product.imageSrc"
      alt=""
      class="pointer-events-none absolute top-0 right-0 size-47.5 object-cover"
    />
  </div>
</template>
