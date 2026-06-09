<script setup lang="ts">
import { AppButton } from '@/shared/ui/AppButton';
import { AppEmptyState } from '@/shared/ui/AppEmptyState';

const handleUpload = () => {
  console.log('Клик по кнопке загрузки CSV');
};
</script>

<template>
  <!-- Чистый прозрачный контейнер без лишних рамок и фонов -->
  <div class="flex flex-1 items-center justify-center min-h-[450px] w-full">
    <AppEmptyState
      title="Нет загрузок"
      description="Загрузите данные, чтобы начать работу с моделью"
    >
      <template #action>
        <AppButton variant="secondary" size="medium" @click="handleUpload">
          Загрузить CSV
        </AppButton>
      </template>
    </AppEmptyState>
  </div>
</template>
