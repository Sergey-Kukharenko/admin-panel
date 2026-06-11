<script setup lang="ts">
import { AppButton } from '@/shared/ui/AppButton';
import { AppEmptyState } from '@/shared/ui/AppEmptyState';

const emit = defineEmits<{
  upload: [];
}>();
</script>

<template>
  <div class="flex flex-1 items-center justify-center min-h-[450px] w-full">
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
