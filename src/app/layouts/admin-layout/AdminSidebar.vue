<script setup lang="ts">
import { PanelLeft } from 'lucide-vue-next';
import { CollapsibleRoot, CollapsibleTrigger } from 'radix-vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import logoUrl from '@/shared/assets/images/logo.svg';

import SidebarNavigation from './SidebarNavigation.vue';

defineOptions({
  name: 'AdminSidebar',
});

const { t } = useI18n({ useScope: 'global' });

// Свёрнутое состояние скрывает навигацию, оставляя только рельс с кнопкой разворота
const isExpanded = ref(true);
</script>

<template>
  <CollapsibleRoot
    v-model:open="isExpanded"
    as="aside"
    class="sticky top-0 flex h-screen shrink-0 self-start flex-col overflow-hidden border-r border-(--border) bg-(--bg-surface-neutral) transition-[width] duration-200 ease-out"
    :class="isExpanded ? 'w-(--sidebar-width)' : 'w-(--sidebar-width-collapsed)'"
  >
    <div class="flex h-12 shrink-0 items-center gap-2 px-3">
      <img v-if="isExpanded" :src="logoUrl" alt="Логотип компании" class="h-4 pl-3" />

      <CollapsibleTrigger
        class="ml-auto flex size-8 shrink-0 items-center justify-center rounded-(--radius-md) text-(--text-tertiary) transition-colors hover:bg-(--muted) hover:text-(--foreground)"
        :aria-label="isExpanded ? t('layout.sidebar.collapse') : t('layout.sidebar.expand')"
      >
        <PanelLeft class="size-4.5" stroke-width="2" />
      </CollapsibleTrigger>
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <SidebarNavigation :is-expanded="isExpanded" />
    </div>
  </CollapsibleRoot>
</template>
