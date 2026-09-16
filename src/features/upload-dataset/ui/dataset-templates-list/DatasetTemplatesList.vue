<script setup lang="ts">
import { ref, watch } from 'vue';

import type { DatasetTemplate, DatasetUpload } from '@/entities/dataset';

import DatasetTemplateItem from '../dataset-template-item/DatasetTemplateItem.vue';

defineOptions({
  name: 'DatasetTemplatesList',
});

const props = defineProps<{
  templates: DatasetTemplate[];
  uploadsMap?: Record<string, DatasetUpload[]>; // Добавили мапу загрузок
  disabled?: boolean;
}>();

const emit = defineEmits<{
  upload: [templateId: string, files: File[]];
  remove: [templateId: string, fileId: string];
  clearAll: [templateId: string];
  downloadTemplate: [templateId: string, templateName: string];
}>();

// Несколько категорий могут быть раскрыты одновременно (раньше был
// одиночный аккордеон — открытие новой сворачивало предыдущую, и не было
// видно прогресс сразу по нескольким типам данных, см. WT-444)
const expandedIds = ref<Set<string>>(new Set());
// Категории, которые мы уже когда-то авто-раскрыли — чтобы не переоткрывать
// принудительно то, что пользователь сам потом свернул вручную
const autoExpandedIds = new Set<string>();

const toggle = (id: string) => {
  const next = new Set(expandedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedIds.value = next;
};

function hasContent(template: DatasetTemplate): boolean {
  return (template.files?.length ?? 0) > 0 || (props.uploadsMap?.[template.id]?.length ?? 0) > 0;
}

// Как только в категорию попадает первый файл — раскрываем её и дальше не
// трогаем: пользователь может свернуть её сам, и мы это уважаем
watch(
  () => props.templates.map((template) => ({ id: template.id, hasContent: hasContent(template) })),
  (items) => {
    const next = new Set(expandedIds.value);
    let changed = false;

    for (const item of items) {
      if (item.hasContent && !autoExpandedIds.has(item.id)) {
        autoExpandedIds.add(item.id);
        next.add(item.id);
        changed = true;
      }
    }

    if (changed) {
      expandedIds.value = next;
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <ul class="flex flex-col">
    <DatasetTemplateItem
      v-for="template in templates"
      :key="template.id"
      :template="template"
      :uploads="uploadsMap?.[template.id] ?? []"
      :expanded="expandedIds.has(template.id)"
      :disabled="disabled"
      @toggle="toggle(template.id)"
      @upload="emit('upload', template.id, $event)"
      @remove="emit('remove', template.id, $event)"
      @clear-all="emit('clearAll', template.id)"
      @download-template="emit('downloadTemplate', template.id, template.title)"
    />
  </ul>
</template>
