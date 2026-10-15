<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { type RouteLocationRaw, useRoute } from 'vue-router';

import { getIntegrationByType } from '@/entities/integration';
import { ROUTE_NAMES } from '@/shared/config/routes';

import HeaderActions from './HeaderActions.vue';

const route = useRoute();
const { t } = useI18n({ useScope: 'global' });

interface BreadcrumbItem {
  label: string;
  to?: RouteLocationRaw;
}

const breadcrumb = computed<BreadcrumbItem[]>(() => {
  if (route.name === ROUTE_NAMES.integrationDetail) {
    const integration = getIntegrationByType(String(route.params.type));

    return [
      { label: t('layout.nav.integrations'), to: { name: ROUTE_NAMES.integrations } },
      { label: integration?.name ?? t('layout.breadcrumbIntegrationFallback') },
    ];
  }

  return route.meta.titleKey ? [{ label: t(route.meta.titleKey) }] : [];
});
</script>

<template>
  <header
    class="flex h-(--header-height) items-center justify-between gap-4 border-b border-(--border) bg-(--surface) px-8"
  >
    <h1 class="flex min-w-0 items-center gap-1 truncate text-sm font-medium">
      <template v-for="(crumb, index) in breadcrumb" :key="crumb.label">
        <RouterLink v-if="crumb.to" :to="crumb.to" class="truncate text-(--text-tertiary)">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="truncate text-(--color-foreground)">{{ crumb.label }}</span>
        <span v-if="index < breadcrumb.length - 1" class="text-(--text-tertiary)">/</span>
      </template>
    </h1>

    <HeaderActions class="shrink-0" />
  </header>
</template>
