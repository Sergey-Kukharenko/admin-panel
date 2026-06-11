<script setup lang="ts">
import { AppButton } from '@/shared/ui/AppButton';
import { AppEmptyState } from '@/shared/ui/AppEmptyState';

const emit = defineEmits<{
  upload: [];
}>();
</script>

<template>
  <div
    class="flex min-h-[400px] flex-1 items-center justify-center rounded-(--radius-lg) border border-(--border) bg-(--card)"
  >
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
