<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { getIntegrationByType } from '@/entities/integration';

import HeaderActions from './HeaderActions.vue';

const route = useRoute();

const routeTitles: Record<string, string> = {
  '/dashboard': 'Главная',
  '/integrations': 'Интеграции',
  '/datasets': 'Загрузка данных',
  '/predictions': 'Предсказания',
  '/billing': 'Тарифы',
  '/profile': 'Профиль',
};

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const breadcrumb = computed<BreadcrumbItem[]>(() => {
  const type = route.params.type;

  if (typeof type === 'string') {
    const integration = getIntegrationByType(type);

    return [
      { label: 'Интеграции', to: '/integrations' },
      { label: integration?.name ?? 'Интеграция' },
    ];
  }

  return [{ label: routeTitles[route.path] ?? 'Загрузка данных' }];
});
</script>

<template>
  <header
    class="flex h-(--header-height) items-center justify-between border-b border-(--border) bg-(--surface) px-8"
  >
    <h1 class="flex items-center gap-1 text-sm font-medium">
      <template v-for="(crumb, index) in breadcrumb" :key="crumb.label">
        <RouterLink v-if="crumb.to" :to="crumb.to" class="text-(--text-tertiary)">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="text-(--color-foreground)">{{ crumb.label }}</span>
        <span v-if="index < breadcrumb.length - 1" class="text-(--text-tertiary)">/</span>
      </template>
    </h1>

    <HeaderActions />
  </header>
</template>
