<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteRecordName } from 'vue-router';

import { routes } from '@/app/router';
import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineOptions({
  name: 'SidebarNavigation',
});

interface NavigationItem {
  label: string;
  name: RouteRecordName;
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

// Пункты меню — маршруты с meta.nav, в порядке объявления в роутере
const items = computed<NavigationItem[]>(() =>
  routes.flatMap((route) =>
    route.name && route.meta?.nav && route.meta.titleKey
      ? [{ label: t(route.meta.titleKey), name: route.name, icon: route.meta.nav.icon }]
      : [],
  ),
);
</script>

<template>
  <nav :class="isExpanded ? 'px-3' : 'px-2'">
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="String(item.name)">
        <RouterLink
          :to="{ name: item.name }"
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
