<script setup lang="ts">
import { CheckCircle2, Trash2, XCircle } from 'lucide-vue-next';

import { MAX_FILE_SIZE } from '@/widgets/dataset-upload-drawer/model/useDatasetFiles';

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
    <!-- Элемент списка (item) -->
    <li
      v-for="file in files"
      :key="file.id"
      class="flex min-h-8 pl-11 pr-2 py-1.5 items-start gap-2 self-stretch bg-transparent hover:bg-(--muted) rounded-sm group transition-colors duration-150 ease-in-out"
    >
      <!-- Проверяем файл на ошибку размера -->
      <template v-if="file.size > MAX_FILE_SIZE">
        <XCircle class="size-4 aspect-square shrink-0 text-[#B21A25] mt-0.5" stroke-width="2" />
      </template>
      <template v-else>
        <CheckCircle2
          class="size-4 aspect-square shrink-0 text-[#528300] mt-0.5"
          stroke-width="2"
        />
      </template>

      <!-- Контейнер с текстом (text) -->
      <div class="flex flex-col items-start flex-1 min-w-0">
        <span
          class="text-sm font-medium text-(--text-primary) leading-5 truncate w-full select-none"
        >
          {{ file.name }}
        </span>

        <!-- Текст ошибки -->
        <span
          v-if="file.size > MAX_FILE_SIZE"
          class="text-xs font-normal text-[#B21A25]/68 leading-4 mt-0.5 select-none"
        >
          Слишком большой файл
        </span>
      </div>

      <!-- Кнопка удаления (корзина) -->
      <button
        type="button"
        class="size-4 aspect-square flex items-center justify-center text-[rgba(48,48,50,0.68)] hover:text-(--danger) transition-colors cursor-pointer mt-0.5"
        @click="emit('remove', file.id)"
      >
        <Trash2 class="size-4 aspect-square" stroke-width="2" />
      </button>
    </li>
  </ul>
</template>
