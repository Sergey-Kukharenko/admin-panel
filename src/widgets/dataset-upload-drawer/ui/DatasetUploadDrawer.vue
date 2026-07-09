<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import { DatasetTemplatesList } from '@/entities/dataset';
import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import { AppBanner } from '@/shared/ui/app-banner';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDrawer } from '@/shared/ui/app-drawer';

import { datasetTemplates, MAX_FILE_SIZE, useDatasetFiles } from '../model';
import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const { filesMap, uploadsMap, addFiles, removeFile, clearTemplateFiles } = useDatasetFiles();

const isConfirmOpen = ref(false);

const templatesWithFiles = computed(() => {
  return datasetTemplates.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
});

const hasValidFiles = computed(() => {
  const allFiles = Object.values(filesMap.value).flat();
  if (allFiles.length === 0) return false;
  return allFiles.every((file) => file.size <= MAX_FILE_SIZE);
});

const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  addFiles(templateId, uploadedFiles);
};

const handleRemove = (templateId: string, fileId: string) => {
  removeFile(fileId);
};

const handleClearAll = (templateId: string) => {
  clearTemplateFiles(templateId);
};

const handleDownloadTemplates = () => {
  console.log('Скачивание архива с шаблонами...');
};

const handleDrawerSubmit = () => {
  if (hasValidFiles.value) {
    isConfirmOpen.value = true;
  }
};

const handleFinalConfirm = () => {
  isConfirmOpen.value = false;
  localStorage.removeItem('dataset_uploaded_files');
  filesMap.value = {};
  emit('submit');
  emit('close');
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка CSV" @close="emit('close')">
    <div class="flex flex-col gap-6 text-left">
      <AppBanner
        title="Шаблоны файлов"
        description="Шаблоны и примеры для всех типов данных. Используйте их при подготовке файлов."
        @action="handleDownloadTemplates"
      >
        <template #icon>
          <img
            :src="sphereImageUrl"
            alt="Шаблоны файлов"
            class="size-full object-contain select-none mix-blend-darken"
          />
        </template>

        <template #action-icon>
          <Download class="size-5" />
        </template>
      </AppBanner>

      <section class="flex flex-col gap-4">
        <header class="flex flex-col gap-1">
          <h3 class="text-sm font-medium text-(--text-primary)">
            Загруженные файлы {{ totalUploadedFiles }}
          </h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Загрузите один или несколько типов данных для обучения моделей. <br />
            Максимальный размер: 500 МБ на файл, формат CSV.
          </p>
        </header>

        <DatasetTemplatesList
          :templates="templatesWithFiles"
          :uploads-map="uploadsMap"
          @upload="handleUpload"
          @remove="handleRemove"
          @clear-all="handleClearAll"
        />
      </section>
    </div>

    <template #footer>
      <DatasetUploadFooter
        :disabled="!hasValidFiles"
        @cancel="emit('close')"
        @submit="handleDrawerSubmit"
      />
    </template>
  </AppDrawer>

  <AppConfirmDialog
    :open="isConfirmOpen"
    title="Подтвердите отправку"
    description="Действие нельзя отменить. Файлы будут отправлены для обучения ML-моделей. После отправки данные нельзя будет отозвать. Процесс обучения займёт от 5 до 14 дней."
    @close="isConfirmOpen = false"
    @confirm="handleFinalConfirm"
  />
</template>
