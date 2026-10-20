<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import type { DashboardProductCard } from '../model/types';
import DashboardProductsModelTag from './DashboardProductsModelTag.vue';

defineProps<{
  card: DashboardProductCard;
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Figma "product card" 52:2382 (availability=true / false): 190px high, radius 16, content on
       the left, 190px illustration on the right -->
  <article
    class="relative flex h-47.5 min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-(--radius-xxl) bg-(image:--bg-product-card)"
  >
    <!-- the text keeps 210px on the right free for the illustration (190px + 20px gap), as in the
         mockup: at the mockup width the description is exactly its 333px. Below ~1250px the title
         is truncated with an ellipsis: accepted by the PM (2026-10-16, desktop only, no layout for
         narrower screens) -->
    <div class="flex flex-col gap-2 pt-5 pr-52.5 pl-5">
      <!-- the tag sits 3px below the top of the 24px title line (2px padding in the library card) -->
      <div class="flex items-center gap-2">
        <h3
          class="truncate text-title-xs font-medium"
          :class="card.isAvailable ? 'text-(--text-primary)' : 'text-(--text-tertiary)'"
        >
          {{ card.name }}
        </h3>
        <DashboardProductsModelTag v-if="card.isAvailable" class="mt-0.5" :tag="card.modelTag" />
      </div>

      <p v-if="card.description" class="text-body-sm text-(--text-secondary)">
        {{ card.description }}
      </p>
    </div>

    <div v-if="card.isAvailable" class="flex items-center gap-3 px-5 py-4">
      <div class="flex flex-col items-start gap-1">
        <span class="font-mono text-element-tag text-(--text-secondary) uppercase">
          {{ t('dashboard.products.data') }}
        </span>
        <AppStatusBadge
          :status="card.dataBadge.status"
          :icon="card.dataBadge.icon"
          :label="card.dataBadge.label"
        />
      </div>

      <div class="flex flex-col items-start gap-1">
        <span class="font-mono text-element-tag text-(--text-secondary) uppercase">
          {{ t('dashboard.products.results') }}
        </span>
        <AppStatusBadge
          :status="card.resultBadge.status"
          :icon="card.resultBadge.icon"
          :label="card.resultBadge.label"
        />
      </div>
    </div>

    <div v-else class="flex items-center gap-2 px-5 py-4">
      <AppIcon name="lock" class="size-3.5 shrink-0 text-(--icon-secondary)" />
      <span class="font-mono text-element-tag font-medium text-(--text-secondary) uppercase">
        {{ t('dashboard.products.unavailable') }}
      </span>
    </div>

    <img
      v-if="card.image"
      :src="card.image"
      alt=""
      class="pointer-events-none absolute top-0 right-0 size-47.5"
    />
  </article>
</template>
