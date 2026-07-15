<script setup lang="ts">
import { ref } from 'vue';

import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import logoUrl from '@/shared/assets/images/logo.svg';
import { AppSidebarBanner } from '@/shared/ui/app-sidebar-banner';

import SidebarNavigation from './SidebarNavigation.vue';

defineOptions({
  name: 'AdminSidebar',
});

const isBannerVisible = ref<boolean>(true);

function handleDownloadTemplates(): void {
  console.log('Клик по баннеру: скачивание шаблонов...');
}

function handleCloseBanner(): void {
  isBannerVisible.value = false;
}
</script>

<template>
  <aside
    class="flex h-screen w-(--sidebar-width) flex-col border-r border-(--border) bg-(--bg-surface-neutral)"
  >
    <div class="flex h-12 items-center px-6">
      <img :src="logoUrl" alt="Логотип компании" class="h-4" />
    </div>

    <SidebarNavigation />

    <div class="mt-auto p-3 min-h-35 flex flex-col justify-end">
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
          v-if="isBannerVisible"
          title="Шаблоны файлов"
          description="Архив содержит шаблоны для всех типов данных. Заполните нужные и загрузите."
          @click="handleDownloadTemplates"
          @close="handleCloseBanner"
        >
          <template #icon>
            <img
              :src="sphereImageUrl"
              alt="Иллюстрация шаблонов"
              class="size-full object-contain select-none mix-blend-darken"
            />
          </template>
        </AppSidebarBanner>
      </Transition>
    </div>
  </aside>
</template>
