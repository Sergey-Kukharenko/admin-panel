<script setup lang="ts">
import { AppButton } from '@/shared/ui/AppButton';
import { AppEmptyState } from '@/shared/ui/AppEmptyState';
</script>

<template>
  <AppEmptyState title="Нет загрузок" description="Загрузите данные, чтобы начать работу с моделью">
    <template #action>
      <AppButton variant="secondary" size="medium"> Загрузить CSV </AppButton>
    </template>
  </AppEmptyState>
</template>
