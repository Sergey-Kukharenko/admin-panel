<script setup lang="ts">
import { ref } from 'vue';

import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppDrawer } from '@/shared/ui/AppDrawer';

import { datasetTemplates } from '../../model/datasetTemplates.ts';
import DatasetUploadFooter from './DatasetUploadFooter.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const totalUploadedFiles = ref(0);

const handleDownload = (id: string) => {
  console.log('download', id);
};

const handleAdd = (id: string) => {
  console.log('add', id);
};

const handleSubmit = () => {
  if (totalUploadedFiles.value > 0) {
    emit('submit');
  }
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка CSV" @close="emit('close')">
    <!-- Основной контент -->
    <div class="flex flex-col gap-6 text-left">
      <DownloadTemplatesBanner />

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
          :templates="datasetTemplates"
          @download="handleDownload"
          @add="handleAdd"
        />
      </section>
    </div>

    <!-- Использование вынесенного компонента футера -->
    <template #footer>
      <DatasetUploadFooter
        :disabled="totalUploadedFiles === 0"
        @cancel="emit('close')"
        @submit="handleSubmit"
      />
    </template>
  </AppDrawer>
</template>
