<script setup lang="ts">
import { FileSpreadsheet } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/AppButton';
import SourceCard from '@/shared/ui/SourceCard';

function handleUpload() {
  console.log('Upload CSV');
}
</script>

<template>
  <SourceCard
    title="CSV загрузка"
    description="Загрузите файл вручную — данные появятся сразу после обработки"
    :icon="FileSpreadsheet"
    active
  >
    <AppButton @click="handleUpload"> Загрузить CSV </AppButton>
  </SourceCard>
</template>
