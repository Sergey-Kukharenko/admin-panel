<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Figma «Нет данных» 1574:181731 (Empty state 92:26924): 300px, no illustration, title/hero and a
       340px body/sm line; the table and the counter are not shown. The text is our own: the frame's
       one speaks about model results (WT-327) -->
  <div data-operations-empty class="flex h-75 flex-col items-center justify-center gap-1 p-8">
    <p class="text-title-sm font-medium text-(--text-primary)">
      {{ t('dashboard.recentOperations.empty.title') }}
    </p>
    <p class="max-w-85 text-center text-body-sm text-(--text-secondary)">
      {{ t('dashboard.recentOperations.empty.description') }}
    </p>
  </div>
</template>
