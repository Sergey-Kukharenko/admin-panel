<script setup lang="ts">
import { ChevronRight, Download, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import { AppButton } from '@/shared/ui/app-button';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

import type { DatasetTemplate } from '../../model/types';
import type { DatasetUpload } from '../../model/upload';
import DatasetFilesList from '../dataset-files-list/DatasetFilesList.vue';
import DatasetTemplateIcon from '../dataset-template-icon/DatasetTemplateIcon.vue';
import DatasetUploadZone from '../dataset-upload-zone/DatasetUploadZone.vue';

defineOptions({
  name: 'DatasetTemplateItem',
});

const DATASET_FILE_ACCEPT = '.csv,text/csv';

const props = withDefaults(
  defineProps<{
    template: DatasetTemplate;
    uploads?: DatasetUpload[];
    expanded?: boolean;
  }>(),
  {
    uploads: () => [],
    expanded: false,
  },
);

const emit = defineEmits<{
  toggle: [];
  upload: [files: File[]];
  remove: [fileId: string];
  clearAll: [];
}>();

const inputRef = ref<HTMLInputElement>();

const files = computed(() => props.template.files ?? []);
const addedFilesCount = computed(() => files.value.length);
const hasFiles = computed(() => files.value.length > 0);
const hasUploads = computed(() => props.uploads.length > 0);
const hasListItems = computed(() => hasFiles.value || hasUploads.value);

const headerClasses = computed(() => ['flex items-center', props.expanded ? 'pt-3 pb-0' : 'py-3']);

const openFilePicker = () => {
  inputRef.value?.click();
};

const expandIfCollapsed = () => {
  if (!props.expanded) {
    emit('toggle');
  }
};

const handleFilesChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFiles = input.files ? Array.from(input.files) : [];

  if (!selectedFiles.length) {
    return;
  }

  expandIfCollapsed();
  emit('upload', selectedFiles);
  input.value = '';
};
</script>

<template>
  <li class="flex w-full flex-col">
    <!-- Header -->
    <div :class="headerClasses">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-start gap-2 text-left"
        @click="emit('toggle')"
      >
        <div class="flex gap-1">
          <ChevronRight
            class="mt-0.5 size-4 shrink-0 text-(--text-secondary) transition-transform duration-200"
            :class="{ 'rotate-90': expanded }"
          />
          <div class="flex shrink-0 items-center pt-0.5">
            <DatasetTemplateIcon :icon="template.icon" />
          </div>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <div class="flex items-center gap-1">
            <h4 class="text-body-sm font-medium text-(--text-primary)">
              {{ template.title }}
            </h4>

            <span
              v-if="addedFilesCount > 0"
              class="text-body-sm font-medium text-(--text-secondary)"
            >
              {{ addedFilesCount }}
            </span>
          </div>
          <p class="text-body-xs text-(--text-secondary)">{{ template.description }}</p>
        </div>
      </button>

      <!-- Actions -->
      <div class="ml-3 flex shrink-0 items-center gap-0.5">
        <AppDropdown align="end" :side-offset="4">
          <template #trigger>
            <AppButton variant="ghost" size="icon">
              <MoreHorizontal class="text-(--text-secondary)" />
            </AppButton>
          </template>
          <AppDropdownItem>
            <Download class="size-4 text-(--text-secondary)" stroke-width="2" />
            <span class="text-body-sm font-medium text-(--text-primary)"> Скачать шаблон </span>
          </AppDropdownItem>
          <AppDropdownItem
            :disabled="!hasFiles"
            class="data-highlighted:bg-red-50!"
            @select="emit('clearAll')"
          >
            <Trash2 class="size-4 text-(--danger)" stroke-width="2" />
            <span class="text-body-sm font-medium text-(--danger)"> Удалить файлы </span>
          </AppDropdownItem>
        </AppDropdown>

        <AppButton variant="ghost" size="icon" @click="openFilePicker">
          <PlusCircle class="text-(--text-secondary)" stroke-width="2" />
        </AppButton>
        <input
          ref="inputRef"
          class="hidden"
          type="file"
          multiple
          :accept="DATASET_FILE_ACCEPT"
          @change="handleFilesChange"
        />
      </div>
    </div>

    <!-- Expanded -->
    <div v-if="expanded" class="pb-3 pl-10 flex flex-col gap-2">
      <DatasetUploadZone
        v-if="!hasListItems"
        :accept="DATASET_FILE_ACCEPT"
        @upload="emit('upload', $event)"
      />

      <DatasetFilesList v-else :files="files" :uploads="uploads" @remove="emit('remove', $event)" />
    </div>
  </li>
</template>
