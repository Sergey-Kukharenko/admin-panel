<script setup lang="ts">
import { computed } from 'vue';

import { AppIcon } from '@/shared/ui/app-icon';

interface Props {
  label: string;
  statusText: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
});

// Динамические стили для тега на основе семантических переменных
const tagStyles = computed(() => {
  return props.isActive
    ? {
        backgroundColor: 'var(--bg-tag-active)',
        color: 'var(--color-green-700)',
      }
    : {
        backgroundColor: 'var(--bg-tag-inactive)',
        color: 'var(--text-primary)',
      };
});
</script>

<template>
  <div
    class="flex items-center gap-1.5 p-[4px_4px_4px_8px] bg-(--card) select-none box-border border border-(--border-default) rounded-(--radius-lg)"
  >
    <!-- Текст названия источника -->
    <span class="font-sans text-sm font-normal leading-[143%] text-(--text-primary)">
      {{ label }}
    </span>

    <!-- Тег статуса -->
    <div
      :style="tagStyles"
      class="flex h-6 max-h-6 items-center justify-center gap-1 px-1.5 py-1 rounded-(--radius-sm) backdrop-blur-[calc(var(--blur,0px)/2)] box-border"
    >
      <!-- В наборе это готовые иконки: гексагон с галочкой (check-alt) и с точкой (cog) -->
      <AppIcon :name="isActive ? 'check-alt' : 'cog'" class="size-3.5" />

      <!-- Текст статуса -->
      <span class="font-mono text-element-tag font-medium uppercase tracking-wide">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>
