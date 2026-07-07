<script setup lang="ts">
import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';

const emit = defineEmits<{
  upload: [];
}>();
</script>

<template>
  <div class="flex flex-1 items-center justify-center min-h-112.5 w-full">
    <AppEmptyState
      title="Нет загрузок"
      description="Загрузите данные, чтобы начать работу с моделью"
    >
      <template #action>
        <AppButton variant="secondary" size="small" @click="emit('upload')">
          Загрузить CSV
        </AppButton>
      </template>
    </AppEmptyState>
  </div>
</template>
