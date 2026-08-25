<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { getIntegrationByType } from '@/entities/integration';

import HeaderActions from './HeaderActions.vue';

const route = useRoute();
const { t } = useI18n({ useScope: 'global' });

const routeTitles = computed<Record<string, string>>(() => ({
  '/dashboard': t('layout.nav.dashboard'),
  '/integrations': t('layout.nav.integrations'),
  '/datasets': t('layout.nav.datasets'),
  '/predictions': t('layout.nav.predictions'),
  '/billing': t('layout.nav.billing'),
  '/profile': t('layout.userMenu.profile'),
}));

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const breadcrumb = computed<BreadcrumbItem[]>(() => {
  const type = route.params.type;

  if (typeof type === 'string') {
    const integration = getIntegrationByType(type);

    return [
      { label: t('layout.nav.integrations'), to: '/integrations' },
      { label: integration?.name ?? t('layout.breadcrumbIntegrationFallback') },
    ];
  }

  return [{ label: routeTitles.value[route.path] ?? t('layout.nav.datasets') }];
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
