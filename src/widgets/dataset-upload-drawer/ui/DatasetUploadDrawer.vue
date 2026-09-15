<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n({ useScope: 'global' });

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

const handleFinalConfirm = () => {
  isConfirmOpen.value = false;

  // Не ждём здесь ответа бэка по всем файлам (WT-450: раньше шторка держала
  // пользователя перед закрытым окном все ~10с, пока грузился большой файл).
  // Стор глобальный и не привязан к шторке, поэтому очередь долетит в фоне;
  // таблица истории сама поллит awaiting/processing и подхватит результат.
  void uploadDatasetStore.submitQueuedFiles().finally(() => {
    uploadDatasetStore.resetAll();
  });

  emit('submit');
  emit('close');
};
</script>

<template>
  <AppDrawer :open="open" :title="t('datasets.upload.title')" @close="emit('close')">
    <div class="flex flex-col gap-6 text-left">
      <AppBanner
        :title="t('datasets.upload.bannerTitle')"
        :description="t('datasets.upload.bannerDescription')"
        @action="handleDownloadTemplates"
      >
        <template #icon>
          <img
            :src="sphereImageUrl"
            alt=""
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
            {{ t('datasets.upload.sectionTitle', { count: totalUploadedFiles }) }}
          </h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            {{ t('datasets.upload.sectionDescriptionLine1') }} <br />
            {{ t('datasets.upload.sectionDescriptionLine2') }}
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
    :title="t('datasets.upload.confirmDialog.title')"
    :description="t('datasets.upload.confirmDialog.description')"
    :confirm-label="t('datasets.upload.confirmDialog.confirmLabel')"
    @close="isConfirmOpen = false"
    @confirm="handleFinalConfirm"
  />
</template>
