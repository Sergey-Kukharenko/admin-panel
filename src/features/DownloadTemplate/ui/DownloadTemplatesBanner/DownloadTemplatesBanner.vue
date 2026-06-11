<script setup lang="ts">
import { Download } from 'lucide-vue-next';

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
    <template #action-icon>
      <Download class="size-4" />
    </template>
  </AppBanner>
</template>
