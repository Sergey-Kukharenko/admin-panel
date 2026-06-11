<script setup lang="ts">
import { DatasetTemplatesList } from '@/entities/Dataset/ui/DatasetTemplatesList';
import { DownloadTemplatesBanner } from '@/features/DownloadTemplate/ui/DownloadTemplatesBanner';
import { AppDrawer } from '@/shared/ui/AppDrawer';
import { AppScrollArea } from '@/shared/ui/AppScrollArea';
import { datasetTemplates } from '@/widgets/DatasetUploadDrawer/model/datasetTemplates.ts';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleDownload = (id: string) => {
  console.log('download', id);
};

const handleAdd = (id: string) => {
  console.log('add', id);
};
</script>

<template>
  <AppDrawer :open="open" title="Загрузка данных" @close="emit('close')">
    <div class="flex flex-col gap-5">
      <DownloadTemplatesBanner />

      <section class="flex flex-col gap-2">
        <header class="flex flex-col gap-1">
          <h3 class="text-body-sm font-medium text-(--text-primary)">Загруженные файлы 0</h3>

          <p class="text-body-xs text-(--text-secondary)">
            Загрузите данные для запуска и работы ML-продуктов. CSV-файлы до 500 МБ.
          </p>
        </header>

        <AppScrollArea>
          <DatasetTemplatesList
            :templates="datasetTemplates"
            @download="handleDownload"
            @add="handleAdd"
          />
        </AppScrollArea>
      </section>
    </div>
  </AppDrawer>
</template>
