<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

import { datasetApi } from '@/entities/dataset';
import { DatasetTemplatesList, useUploadDatasetStore } from '@/features/upload-dataset';
import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import { downloadBlob } from '@/shared/lib/downloadBlob';
import { AppBanner } from '@/shared/ui/app-banner';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDrawer } from '@/shared/ui/app-drawer';

import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const uploadDatasetStore = useUploadDatasetStore();
const { templates, filesMap, uploadsMap, isSubmitting } = storeToRefs(uploadDatasetStore);

onMounted(() => {
  uploadDatasetStore.init();
});

const isConfirmOpen = ref(false);

const templatesWithFiles = computed(() => {
  return templates.value.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

const totalUploadedFiles = computed(() => {
  const uploadedCount = Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
  const queuedCount = Object.values(uploadsMap.value).reduce(
    (acc, uploads) => acc + uploads.filter((upload) => upload.status !== 'error').length,
    0,
  );

  return uploadedCount + queuedCount;
});

const hasValidFiles = computed(() => {
  return Object.values(uploadsMap.value).some((uploads) =>
    uploads.some((upload) => upload.status === 'queued'),
  );
});

const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  uploadDatasetStore.addFiles(templateId, uploadedFiles);
};

const handleRemove = (_templateId: string, fileId: string) => {
  uploadDatasetStore.removeFile(fileId);
};

const handleClearAll = (templateId: string) => {
  uploadDatasetStore.clearTemplateFiles(templateId);
};

const handleDownloadTemplates = async () => {
  try {
    const response = await datasetApi.downloadTemplatesArchive();

    downloadBlob(response.data, 'dataset_templates.zip');
  } catch (error) {
    console.error('Ошибка при скачивании архива шаблонов:', error);
  }
};

const handleDrawerSubmit = () => {
  if (hasValidFiles.value) {
    isConfirmOpen.value = true;
  }
};

const handleFinalConfirm = async () => {
  isConfirmOpen.value = false;

  await uploadDatasetStore.submitQueuedFiles();

  uploadDatasetStore.resetAll();
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
          @download-template="(id, name) => uploadDatasetStore.downloadTemplateFile(id, name)"
        />
      </section>
    </div>

    <template #footer>
      <DatasetUploadFooter
        :disabled="!hasValidFiles || isSubmitting"
        :submitting="isSubmitting"
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
