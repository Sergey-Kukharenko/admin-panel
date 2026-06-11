<script setup lang="ts">
import type { DatasetTemplate } from '@/entities/Dataset/model/types.ts';
import { DatasetTemplateItem } from '@/entities/Dataset/ui/DatasetTemplateItem';

defineProps<{
  templates: DatasetTemplate[];
}>();

const emit = defineEmits<{
  download: [string];
  add: [string];
}>();
</script>

<template>
  <ul class="flex flex-col">
    <DatasetTemplateItem
      v-for="template in templates"
      :key="template.id"
      :template="template"
      @download="emit('download', $event)"
      @add="emit('add', $event)"
    />
  </ul>
</template>
