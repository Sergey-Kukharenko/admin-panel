<script setup lang="ts">
import { Circle, Trash2, XCircle } from 'lucide-vue-next';
import { computed } from 'vue';

import type { DatasetUpload } from '@/entities/dataset/model/upload';
import { DatasetUploadSpinner } from '@/entities/dataset/ui/dataset-upload-spinner';

defineOptions({
  name: 'DatasetUploadItem',
});

const props = defineProps<{
  upload: DatasetUpload;
}>();

const emit = defineEmits<{
  remove: [string]; // Событие удаления принимает ID файла
}>();

const status = computed(() => props.upload.status?.toLowerCase());

const isQueued = computed(() => status.value === 'queued');
const isUploading = computed(() => status.value === 'uploading');
const isError = computed(() => status.value === 'error');

const progressStyle = computed(() => ({
  width: `${props.upload.progress ?? 0}%`,
}));
</script>

<template>
  <li
    :class="[
      'flex min-h-8 pr-2 items-start self-stretch bg-transparent transition-colors duration-150 ease-in-out w-full',
      isUploading ? 'pl-0 py-0.5' : 'pl-1 py-1.5 gap-2',
    ]"
  >
    <!-- КЕЙС 1: АКТИВНАЯ ЗАГРУЗКА -->
    <template v-if="isUploading">
      <div
        class="relative flex flex-1 flex-col items-start justify-center rounded-md bg-(--muted) overflow-hidden py-1 min-h-[35px] w-full"
      >
        <div class="flex w-full items-center justify-between gap-2 z-10 self-stretch pl-2 pr-3">
          <div class="flex items-center gap-2 min-w-0">
            <DatasetUploadSpinner
              :progress="upload.progress ?? 0"
              class="text-(--progress-fill) pt-0.5"
            />

            <span class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none">
              {{ upload.source.name }}
            </span>
          </div>

          <span
            class="font-mono text-[10px] font-normal leading-[15px] text-(--text-tertiary) shrink-0 select-none"
          >
            {{ upload.progress ?? 0 }}%
          </span>
        </div>

        <div class="w-full mt-auto z-10 self-stretch pl-7.5 pr-3 pb-[1px]">
          <div class="h-[2px] w-full rounded-full bg-(--progress-track)">
            <div
              class="h-full rounded-full bg-(--progress-fill) transition-all duration-300 ease-out"
              :style="progressStyle"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- КЕЙС 2: ФАЙЛ В ОЧЕРЕДИ -->
    <template v-else-if="isQueued">
      <div class="shrink-0 flex items-center justify-center h-5">
        <Circle class="size-3.5 text-(--icon-muted)" :stroke-width="1.5" />
      </div>

      <span class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none">
        {{ upload.source.name }}
      </span>
    </template>

    <!-- КЕЙС 3: ОШИБКА ЗАГРУЗКИ -->
    <template v-else-if="isError">
      <div class="shrink-0 flex items-center justify-center h-5">
        <XCircle class="size-3.5 text-(--danger)" :stroke-width="1.5" />
      </div>

      <div class="flex flex-col items-start flex-1 min-w-0">
        <!-- Текст заголовка всегда базового цвета -->
        <span
          class="text-sm font-medium leading-5 truncate w-full select-none text-(--text-primary)"
        >
          {{ upload.source.name }}
        </span>

        <!-- Текст ошибки выводится под заголовком -->
        <span class="text-xs font-normal text-(--danger) leading-4 mt-0.5 select-none">
          {{ upload.error || 'Размер превышает 500 МБ' }}
        </span>
      </div>

      <!-- ИСПРАВЛЕНО: Корзина обернута в аналогичный h-5 для фиксации по верхней строке -->
      <div class="shrink-0 flex items-center justify-center h-5">
        <button
          type="button"
          class="size-4 flex items-center justify-center text-[rgba(48,48,50,0.68)] hover:text-(--danger) transition-colors cursor-pointer"
          @click="emit('remove', upload.id)"
        >
          <Trash2 class="size-4 aspect-square" stroke-width="2" />
        </button>
      </div>
    </template>
  </li>
</template>
