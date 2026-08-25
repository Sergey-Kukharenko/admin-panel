<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CreditCardIcon from '@/shared/assets/icons/navigation/billing.svg?component';
import DatabaseIcon from '@/shared/assets/icons/navigation/datasets.svg?component';
import HomeIcon from '@/shared/assets/icons/navigation/home.svg?component';
import PlugIcon from '@/shared/assets/icons/navigation/integrations.svg?component';
import SparklesIcon from '@/shared/assets/icons/navigation/predictions.svg?component';

defineOptions({
  name: 'SidebarNavigation',
});

interface NavigationItem {
  label: string;
  to: string;
  icon: Component;
}

const { t } = useI18n({ useScope: 'global' });

const items = computed<NavigationItem[]>(() => [
  {
    label: t('layout.nav.dashboard'),
    to: '/dashboard',
    icon: HomeIcon,
  },
  {
    label: t('layout.nav.integrations'),
    to: '/integrations',
    icon: PlugIcon,
  },
  {
    label: t('layout.nav.datasets'),
    to: '/datasets',
    icon: DatabaseIcon,
  },
  {
    label: t('layout.nav.predictions'),
    to: '/predictions',
    icon: SparklesIcon,
  },
  {
    label: t('layout.nav.billing'),
    to: '/billing',
    icon: CreditCardIcon,
  },
]);
</script>

<template>
  <nav class="px-3">
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="group flex h-9 items-center gap-3 rounded-(--radius-sm) px-3 text-[14px] leading-5 font-medium text-(--muted-foreground) transition-all hover:bg-(--muted) hover:text-(--foreground)"
          active-class="bg-(--sidebar-item-active) !text-(--sidebar-item-active-foreground)"
        >
          <component :is="item.icon" class="h-4.5 w-4.5 shrink-0" />

          <span>
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
