<script setup lang="ts">
import { CheckCircle2, Trash2, XCircle } from 'lucide-vue-next';

import { MAX_FILE_SIZE } from '@/widgets/dataset-upload-drawer/model';

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
      class="flex min-h-8 pl-1 pr-2 py-1.5 items-start gap-2 self-stretch bg-transparent hover:bg-(--muted) rounded-sm group transition-colors duration-150 ease-in-out"
    >
      <!-- Проверяем файл на ошибку размера -->
      <div class="shrink-0 flex items-center justify-center pt-[3px]">
        <XCircle
          v-if="file.size > MAX_FILE_SIZE"
          class="size-3.5 text-(--danger)"
          stroke-width="1.5"
        />
        <CheckCircle2 v-else class="size-3.5 text-(--success)" stroke-width="1.5" />
      </div>

      <!-- Контейнер с текстом (text) -->
      <div class="flex flex-col items-start flex-1 min-w-0">
        <!-- ИСПРАВЛЕНО: Цвет текста имени файла теперь всегда text-(--text-primary) как в макете -->
        <span
          class="text-sm font-medium leading-5 truncate w-full select-none text-(--text-primary)"
        >
          {{ file.name }}
        </span>

        <!-- Текст ошибки изменен строго под макет Figma -->
        <span
          v-if="file.size > MAX_FILE_SIZE"
          class="text-xs font-normal text-(--danger) leading-4 mt-0.5 select-none"
        >
          Размер превышает 500 МБ
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
