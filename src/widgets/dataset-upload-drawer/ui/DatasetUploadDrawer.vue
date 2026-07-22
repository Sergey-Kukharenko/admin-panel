<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import { datasetApi, DatasetTemplatesList } from '@/entities/dataset'; // Добавлен datasetApi для скачивания архива
import sphereImageUrl from '@/shared/assets/images/file-templates-sphere.jpg';
import { AppBanner } from '@/shared/ui/app-banner';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDrawer } from '@/shared/ui/app-drawer';

import { useDatasetFiles } from '../model'; // ИСПРАВЛЕНО: Удален импорт статических моков datasetTemplates
import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const {
  templates,
  filesMap,
  uploadsMap,
  addFiles,
  removeFile,
  clearTemplateFiles,
  downloadTemplateFile,
} = useDatasetFiles();

const isConfirmOpen = ref(false);

// ИСПРАВЛЕНО: Вычисляемое свойство теперь маппит файлы на динамический массив templates с бэкенда
const templatesWithFiles = computed(() => {
  return templates.value.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
});

const hasValidFiles = computed(() => {
  return Object.values(filesMap.value).some((files) => files.length > 0);
});

const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  addFiles(templateId, uploadedFiles);
};

const handleRemove = (_templateId: string, fileId: string) => {
  removeFile(fileId);
};

const handleClearAll = (templateId: string) => {
  clearTemplateFiles(templateId);
};

// ИСПРАВЛЕНО: Реализовано скачивание реального ZIP-архива шаблонов с бэкенда
const handleDownloadTemplates = async () => {
  try {
    const response = await datasetApi.downloadTemplatesArchive();

    // Создаем ссылку для скачивания Blob (бинарного архива)
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dataset_templates.zip'); // Название скачиваемого файла
    document.body.appendChild(link);
    link.click();

    // Очищаем DOM-дерево и память
    link.remove();
    window.URL.revokeObjectURL(url);
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
          @download-template="(id, name) => downloadTemplateFile(id, name)"
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
