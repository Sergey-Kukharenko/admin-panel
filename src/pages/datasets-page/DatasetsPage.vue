<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { DatasetHistoryTable } from '@/widgets/dataset-history-table';
import { DatasetUploadDrawer } from '@/widgets/dataset-upload-drawer';

defineOptions({
  name: 'DatasetsPage',
});

const { t } = useI18n({ useScope: 'global' });

// Флаг открытия шторки
const isDrawerOpen = ref(false);

// Есть ли реальная история загрузок (шаблоны и файлы) — решает виджет DatasetHistoryTable
const hasHistory = ref(true);
</script>

<template>
  <div class="flex w-full flex-col gap-10 text-left">
    <!-- Шапка страницы: заголовок и описание -->
    <div class="flex flex-col gap-1">
      <h1 class="text-title-sm font-medium text-(--text-primary)">{{ t('datasets.page.title') }}</h1>

      <p class="max-w-118.25 text-body-sm text-(--text-secondary)">
        {{ t('datasets.page.description') }}
      </p>
    </div>

    <!-- Виджет сам решает, показывать таблицу истории или пустое состояние -->
    <DatasetHistoryTable
      v-model:has-history="hasHistory"
      @open-upload-drawer="isDrawerOpen = true"
    />

    <!-- Шторка загрузки файлов -->
    <DatasetUploadDrawer
      :open="isDrawerOpen"
      @close="isDrawerOpen = false"
      @submit="isDrawerOpen = false"
    />
  </div>
</template>
