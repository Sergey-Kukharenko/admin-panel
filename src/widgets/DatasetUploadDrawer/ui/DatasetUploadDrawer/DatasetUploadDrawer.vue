<script setup lang="ts">
import { computed } from 'vue';

import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppDrawer } from '@/shared/ui/AppDrawer';

import { datasetTemplates, useDatasetFiles } from '../../model';
import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

// Подключаем хранилище
const { filesMap, addFiles, removeFile } = useDatasetFiles();

// Объединяем шаблоны со стейтом файлов
const templatesWithFiles = computed(() => {
  return datasetTemplates.map((template) => ({
    ...template,
    files: filesMap.value[template.id] ?? [],
  }));
});

// Считаем общее количество файлов для шапки и футера
const totalUploadedFiles = computed(() => {
  return Object.values(filesMap.value).reduce((acc, files) => acc + files.length, 0);
});

const handleDownload = (id: string) => {
  console.log('download template schema:', id);
};

// Исправлено: имя функции и логика теперь соответствуют событию @upload
const handleUpload = (templateId: string, uploadedFiles: File[]) => {
  addFiles(templateId, uploadedFiles);
};

// Исправлено: метод принимает templateId и fileId, как отправляет DatasetTemplatesList
const handleRemove = (templateId: string, fileId: string) => {
  removeFile(fileId);
};

const handleSubmit = () => {
  if (totalUploadedFiles.value > 0) {
    emit('submit');
  }
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка CSV" @close="emit('close')">
    <div class="flex flex-col gap-6 text-left">
      <DownloadTemplatesBanner />

      <section class="flex flex-col gap-4">
        <header class="flex flex-col gap-1">
          <h3 class="text-sm font-medium text-(--text-primary)">
            Загруженные файлы {{ totalUploadedFiles }}
          </h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Загрузите один или несколько типов данных для обучения моделей. <br />
            Максимальный размер: 500 МБ на файл, format CSV.
          </p>
        </header>

        <!-- ИСПРАВЛЕНО: слушаем @upload вместо @add, и передаем правильные хэндлеры -->
        <DatasetTemplatesList
          :templates="templatesWithFiles"
          @download="handleDownload"
          @upload="handleUpload"
          @remove="handleRemove"
        />
      </section>
    </div>

    <template #footer>
      <DatasetUploadFooter
        :disabled="totalUploadedFiles === 0"
        @cancel="emit('close')"
        @submit="handleSubmit"
      />
    </template>
  </AppDrawer>
</template>
