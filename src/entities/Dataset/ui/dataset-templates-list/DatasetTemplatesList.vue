<script setup lang="ts">
import { ref } from 'vue';

import type { DatasetTemplate } from '@/entities/dataset/model/types';
import { DatasetTemplateItem } from '@/entities/dataset/ui/dataset-template-item';

defineOptions({
  name: 'DatasetTemplateList',
});

defineProps<{
  templates: DatasetTemplate[];
}>();

const emit = defineEmits<{
  upload: [templateId: string, files: File[]];
  remove: [templateId: string, fileId: string];
  clearAll: [templateId: string];
  download: [templateId: string];
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
      :expanded="expandedId === template.id"
      @toggle="toggle(template.id)"
      @upload="emit('upload', template.id, $event)"
      @remove="emit('remove', template.id, $event)"
      @clear-all="emit('clearAll', template.id)"
    />
  </ul>
</template>
