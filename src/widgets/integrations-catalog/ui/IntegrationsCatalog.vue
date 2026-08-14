<script setup lang="ts">
import { INTEGRATIONS } from '@/entities/integration';

import { IntegrationCard } from './integration-card';

defineOptions({
  name: 'IntegrationsCatalog',
});
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-lg font-medium text-(--text-primary)">Интеграции</p>
      <p class="text-sm text-(--text-secondary)">
        Переведите загрузку данных в автоматический режим с помощью интеграций. Управляйте
        источниками здесь, а историю и результаты поступлений отслеживайте в разделе «Загрузка
        данных».
      </p>
    </div>

    <div class="flex flex-wrap gap-6">
      <IntegrationCard
        v-for="integration in INTEGRATIONS"
        :key="integration.type"
        :integration="integration"
      />
    </div>
  </div>
</template>
