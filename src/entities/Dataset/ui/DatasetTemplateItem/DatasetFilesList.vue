<script setup lang="ts">
import { CheckCircle2, Trash2 } from 'lucide-vue-next';

export interface DatasetFile {
  id: string;
  name: string;
  size: number;
}

defineOptions({
  name: 'DatasetFileList',
});

defineProps<{
  files: DatasetFile[];
}>();

const emit = defineEmits<{
  remove: [string];
}>();
</script>

<template>
  <!-- Список файлов (list) -->
  <ul class="flex flex-col items-start self-stretch w-full gap-1.5 mt-2">
    <li
      v-for="file in files"
      :key="file.id"
      class="flex h-8 max-h-12 pl-11 pr-2 py-1.5 items-center gap-2 self-stretch bg-transparent hover:bg-(--muted) rounded-(--radius-sm) group transition-colors duration-150 ease-in-out"
    >
      <CheckCircle2 class="size-4 aspect-square flex-shrink-0 text-[#528300]" stroke-width="2" />

      <div class="flex flex-col items-start flex-1 min-w-0">
        <span
          class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 truncate w-full select-none"
        >
          {{ file.name }}
        </span>
      </div>

      <button
        type="button"
        class="size-4 aspect-square flex items-center justify-center text-[rgba(48,48,50,0.68)] hover:text-(--danger) transition-colors cursor-pointer"
        @click="emit('remove', file.id)"
      >
        <Trash2 class="size-4 aspect-square" stroke-width="2" />
      </button>
    </li>
  </ul>
</template>
