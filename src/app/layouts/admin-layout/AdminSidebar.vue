<script setup lang="ts">
import { PanelLeft } from 'lucide-vue-next';
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'radix-vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useHasProcessingFiles } from '@/entities/dataset';
import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import logoUrl from '@/shared/assets/images/logo.svg';
import { AppSidebarBanner } from '@/shared/ui/app-sidebar-banner';

import SidebarNavigation from './SidebarNavigation.vue';

defineOptions({
  name: 'AdminSidebar',
});

const router = useRouter();
const { t } = useI18n({ useScope: 'global' });

// Свёрнутое состояние скрывает навигацию и баннер, оставляя только рельс с кнопкой разворота
const isExpanded = ref(true);

const isBannerVisible = ref<boolean>(true);

// Баннер с шаблонами файлов убрали (WT-441, заменяется гайд-туром в отдельном
// эпике) — сайдбар теперь напоминает только про обработку загруженных данных
const { hasProcessingFiles } = useHasProcessingFiles();

function handleBannerClick(): void {
  router.push('/datasets');
}

function handleCloseBanner(): void {
  isBannerVisible.value = false;
}
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

      <CollapsibleContent class="mt-auto">
        <div class="p-3 min-h-35 flex flex-col justify-end">
          <Transition
            appear
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 max-h-(--sidebar-banner-max-height)"
            leave-to-class="opacity-0 scale-95 max-h-0 p-0 margin-0 overflow-hidden"
          >
            <AppSidebarBanner
              v-if="isBannerVisible && hasProcessingFiles"
              :title="t('layout.sidebar.processingBanner.title')"
              :description="t('layout.sidebar.processingBanner.description')"
              @click="handleBannerClick"
              @close="handleCloseBanner"
            >
              <template #icon>
                <img
                  :src="sphereImageUrl"
                  alt=""
                  class="size-full object-contain select-none mix-blend-darken"
                />
              </template>
            </AppSidebarBanner>
          </Transition>
        </div>
      </CollapsibleContent>
    </div>
  </CollapsibleRoot>
</template>
