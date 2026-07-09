<script setup lang="ts">
import { ref } from 'vue';

import type { DatasetTemplate } from '../../model/types';
import type { DatasetUpload } from '../../model/upload'; // Импортируем тип из соседнего файла модели
import DatasetTemplateItem from '../dataset-template-item/DatasetTemplateItem.vue';

defineOptions({
  name: 'DatasetTemplatesList',
});

defineProps<{
  templates: DatasetTemplate[];
  uploadsMap?: Record<string, DatasetUpload[]>; // Добавили мапу загрузок
}>();

const emit = defineEmits<{
  upload: [templateId: string, files: File[]];
  remove: [templateId: string, fileId: string];
  clearAll: [templateId: string];
}>();

const expandedId = ref<string | null>(null);

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};
</script>

<template>
  <ul class="flex flex-col">
    <DatasetTemplateItem
      v-for="template in templates"
      :key="template.id"
      :template="template"
      :uploads="uploadsMap?.[template.id] ?? []"
      :expanded="expandedId === template.id"
      @toggle="toggle(template.id)"
      @upload="emit('upload', template.id, $event)"
      @remove="emit('remove', template.id, $event)"
      @clear-all="emit('clearAll', template.id)"
    />
  </ul>
</template>
