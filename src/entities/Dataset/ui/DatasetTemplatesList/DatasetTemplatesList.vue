<script setup lang="ts">
import { ref } from 'vue';

import type { DatasetTemplate } from '@/entities/Dataset/model/types';
import { DatasetTemplateItem } from '@/entities/Dataset/ui/DatasetTemplateItem';

defineOptions({
  name: 'DatasetTemplateList',
});

defineProps<{
  templates: DatasetTemplate[];
}>();

const emit = defineEmits<{
  upload: [templateId: string, files: File[]];
  remove: [templateId: string, fileId: string];
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
    />
  </ul>
</template>
