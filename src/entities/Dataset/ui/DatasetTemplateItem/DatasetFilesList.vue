<script setup lang="ts">
import { X } from 'lucide-vue-next';

import { AppIconButton } from '@/shared/ui/AppIconButton';

export interface DatasetFile {
  id: string;
  name: string;
  size: number;
}

defineOptions({
  name: 'DatasetFilesList',
});

defineProps<{
  files: DatasetFile[];
}>();

const emit = defineEmits<{
  remove: [string];
}>();

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
  <ul class="flex flex-col rounded-(--radius-md) border border-(--border)">
    <li
      v-for="file in files"
      :key="file.id"
      class="flex items-center gap-3 border-b border-(--border) p-3 last:border-b-0"
    >
      <div class="flex min-w-0 flex-1 flex-col">
        <span class="truncate text-body-sm font-medium text-(--text-primary)">
          {{ file.name }}
        </span>

        <span class="text-body-xs text-(--text-secondary)">
          {{ formatSize(file.size) }}
        </span>
      </div>

      <AppIconButton variant="ghost" @click="emit('remove', file.id)">
        <X class="size-4" />
      </AppIconButton>
    </li>
  </ul>
</template>
