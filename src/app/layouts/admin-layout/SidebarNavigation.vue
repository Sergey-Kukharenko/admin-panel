<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineOptions({
  name: 'SidebarNavigation',
});

interface NavigationItem {
  label: string;
  to: string;
  icon: IconName;
}

withDefaults(
  defineProps<{
    isExpanded?: boolean;
  }>(),
  {
    isExpanded: true,
  },
);

const { t } = useI18n({ useScope: 'global' });

const items = computed<NavigationItem[]>(() => [
  {
    label: t('layout.nav.dashboard'),
    to: '/dashboard',
    icon: 'function-line',
  },
  {
    label: t('layout.nav.integrations'),
    to: '/integrations',
    icon: 'connector-line',
  },
  {
    label: t('layout.nav.datasets'),
    to: '/datasets',
    icon: 'folder-check-line',
  },
  {
    label: t('layout.nav.predictions'),
    to: '/predictions',
    icon: 'sparkling-line',
  },
  {
    label: t('layout.nav.billing'),
    to: '/billing',
    icon: 'receipt-line',
  },
]);
</script>

<template>
  <nav :class="isExpanded ? 'px-3' : 'px-2'">
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          :title="!isExpanded ? item.label : undefined"
          :class="[
            'group flex h-9 items-center gap-3 rounded-(--radius-sm) text-[14px] leading-5 font-medium text-(--muted-foreground) transition-all hover:bg-(--muted) hover:text-(--foreground)',
            isExpanded ? 'px-3' : 'justify-center px-0',
          ]"
          active-class="bg-(--sidebar-item-active) !text-(--sidebar-item-active-foreground)"
        >
          <AppIcon :name="item.icon" class="size-4.5" />

          <span v-if="isExpanded">
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
