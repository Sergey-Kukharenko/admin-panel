<script setup lang="ts">
import type { DatasetUpload } from '@/entities/dataset/model/upload';
import { DatasetUploadItem } from '@/entities/dataset/ui/dataset-upload-item';

defineOptions({
  name: 'DatasetUploadList',
});

withDefaults(
  defineProps<{
    uploads?: DatasetUpload[];
  }>(),
  {
    uploads: () => [],
  },
);

// ДОБАВЛЕНО: Объявляем событие удаления элемента загрузки
const emit = defineEmits<{
  removeUpload: [fileId: string];
}>();
</script>

<template>
  <ul class="flex w-full flex-col items-start gap-1.5 self-stretch">
    <!-- Слушаем событие @remove из айтема и прокидываем его дальше наружу -->
    <DatasetUploadItem
      v-for="upload in uploads"
      :key="upload.id"
      :upload="upload"
      @remove="emit('removeUpload', $event)"
    />
  </ul>
</template>
