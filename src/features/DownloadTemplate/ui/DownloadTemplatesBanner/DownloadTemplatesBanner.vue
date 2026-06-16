<script setup lang="ts">
import { Download } from 'lucide-vue-next';

import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import { AppBanner } from '@/shared/ui/AppBanner';

defineOptions({
  name: 'DownloadTemplatesBanner',
});

const emit = defineEmits<{
  download: [];
}>();
</script>

<template>
  <AppBanner
    title="Шаблоны файлов"
    description="Шаблоны и примеры для всех типов данных. Используйте их при подготовке файлов."
    @action="emit('download')"
  >
    <!-- Передаем картинку в слот для иконки баннера -->
    <template #icon>
      <img
        :src="sphereImageUrl"
        alt="Шаблоны файлов"
        class="w-full h-full object-contain select-none mix-blend-darken"
      />
    </template>

    <template #action-icon>
      <Download class="size-5" />
    </template>
  </AppBanner>
</template>
