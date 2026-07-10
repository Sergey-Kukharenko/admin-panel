<script setup lang="ts">
import { CheckCircle2, Circle, Trash2, XCircle } from 'lucide-vue-next';
import { computed } from 'vue';

import type { DatasetFile } from '@/entities/dataset/model/types';
import type { DatasetUpload } from '@/entities/dataset/model/upload';
import { DatasetUploadSpinner } from '@/entities/dataset/ui/dataset-upload-spinner';

defineOptions({
  name: 'DatasetFilesList',
});

const props = withDefaults(
  defineProps<{
    files?: DatasetFile[];
    uploads?: DatasetUpload[];
  }>(),
  {
    files: () => [],
    uploads: () => [],
  },
);

const emit = defineEmits<{
  remove: [string];
}>();

type ListItem =
  | {
      type: 'file';
      id: string;
      file: DatasetFile;
    }
  | {
      type: 'upload';
      id: string;
      upload: DatasetUpload;
    };

const items = computed<ListItem[]>(() => {
  const fileIds = new Set(props.files.map((file) => file.id));

  return [
    ...props.files.map((file) => ({
      type: 'file' as const,
      id: file.id,
      file,
    })),
    ...props.uploads
      .filter((upload) => !fileIds.has(upload.id))
      .map((upload) => ({
        type: 'upload' as const,
        id: upload.id,
        upload,
      })),
  ];
});

const isQueued = (upload: DatasetUpload) => upload.status === 'queued';
const isUploading = (upload: DatasetUpload) => upload.status === 'uploading';
const isError = (upload: DatasetUpload) => upload.status === 'error';

const getProgressStyle = (upload: DatasetUpload) => ({
  width: `${upload.progress ?? 0}%`,
});
</script>

<template>
  <ul class="flex flex-col items-start self-stretch w-full gap-1.5 mt-2">
    <li
      v-for="item in items"
      :key="item.id"
      :class="[
        'flex min-h-8 items-start self-stretch bg-transparent transition-colors duration-150 ease-in-out w-full',
        item.type === 'upload' && isUploading(item.upload)
          ? 'pr-2 pl-0 py-0.5'
          : 'pl-1 pr-2 py-1.5 gap-2 hover:bg-(--muted) rounded-sm group',
      ]"
    >
      <template v-if="item.type === 'file'">
        <div class="shrink-0 flex items-center justify-center pt-[3px] w-4 h-4">
          <CheckCircle2 class="size-3.5 text-(--success)" stroke-width="1.5" />
        </div>

        <div class="flex flex-col items-start flex-1 min-w-0">
          <span
            class="text-sm font-medium leading-5 truncate w-full select-none text-(--text-primary)"
          >
            {{ item.file.name }}
          </span>
        </div>

        <button
          type="button"
          class="size-4 aspect-square flex items-center justify-center text-(--text-secondary) hover:text-(--danger) transition-colors cursor-pointer mt-0.5"
          @click="emit('remove', item.file.id)"
        >
          <Trash2 class="size-4 aspect-square" stroke-width="2" />
        </button>
      </template>

      <template v-else-if="isUploading(item.upload)">
        <div
          class="relative flex flex-1 flex-col items-start justify-center rounded-md bg-(--muted) overflow-hidden py-1 min-h-[35px] w-full"
        >
          <div class="flex w-full items-center justify-between gap-2 z-10 self-stretch pl-2 pr-3">
            <div class="flex items-center gap-2 min-w-0">
              <DatasetUploadSpinner
                :progress="item.upload.progress ?? 0"
                class="text-(--progress-fill) pt-0.5"
              />

              <span
                class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none"
              >
                {{ item.upload.source.name }}
              </span>
            </div>

            <span
              class="font-mono text-body-2xs font-normal text-(--text-tertiary) shrink-0 select-none"
            >
              {{ item.upload.progress ?? 0 }}%
            </span>
          </div>

          <div class="w-full mt-auto z-10 self-stretch pl-7.5 pr-3 pb-[1px]">
            <div class="h-[2px] w-full rounded-full bg-(--progress-track)">
              <div
                class="h-full rounded-full bg-(--progress-fill) transition-all duration-75 ease-linear"
                :style="getProgressStyle(item.upload)"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="isQueued(item.upload)">
        <div class="shrink-0 flex items-center justify-center h-5">
          <Circle class="size-3.5 text-(--icon-muted)" :stroke-width="1.5" />
        </div>

        <span class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none">
          {{ item.upload.source.name }}
        </span>
      </template>

      <template v-else-if="isError(item.upload)">
        <div class="shrink-0 flex items-center justify-center h-5">
          <XCircle class="size-3.5 text-(--danger)" stroke-width="1.5" />
        </div>

        <div class="flex flex-col items-start flex-1 min-w-0">
          <span
            class="text-sm font-medium leading-5 truncate w-full select-none text-(--text-primary)"
          >
            {{ item.upload.source.name }}
          </span>

          <span class="text-xs font-normal text-(--danger) leading-4 mt-0.5 select-none">
            {{ item.upload.error }}
          </span>
        </div>

        <div class="shrink-0 flex items-center justify-center h-5">
          <button
            type="button"
            class="size-4 flex items-center justify-center text-(--text-secondary) hover:text-(--danger) transition-colors cursor-pointer"
            @click="emit('remove', item.upload.id)"
          >
            <Trash2 class="size-4 aspect-square" stroke-width="2" />
          </button>
        </div>
      </template>
    </li>
  </ul>
</template>
