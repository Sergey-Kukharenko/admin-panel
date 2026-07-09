<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'DatasetUploadSpinner',
});

const props = withDefaults(
  defineProps<{
    progress?: number;
  }>(),
  {
    progress: 0,
  },
);

const RADIUS = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~37.699

const normalizedProgress = computed(() => {
  return Math.min(Math.max(props.progress, 0), 100);
});

// Вычисляем длину заполненного штриха
const strokeDasharray = computed(() => {
  const filledLength = (normalizedProgress.value / 100) * CIRCUMFERENCE;
  return `${filledLength} ${CIRCUMFERENCE}`;
});
</script>

<template>
  <svg class="size-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
    <!-- Фоновое статичное кольцо -->
    <circle
      cx="7"
      cy="7"
      :r="RADIUS"
      stroke="var(--progress-fill)"
      stroke-opacity="0.15"
      stroke-width="1.5"
    />

    <!-- Активный сектор загрузки (плавно растет по часовой стрелке) -->
    <circle
      class="upload-spinner-progress spinner-arc"
      cx="7"
      cy="7"
      :r="RADIUS"
      stroke="var(--progress-fill)"
      stroke-width="1.5"
      stroke-linecap="round"
      :stroke-dasharray="strokeDasharray"
    />
  </svg>
</template>

<style scoped>
.upload-spinner-progress {
  transition: stroke-dasharray 250ms ease-out;
}

/* Разворачиваем круг, чтобы заполнение начиналось строго сверху (на 12 часов) */
.spinner-arc {
  transform-origin: center;
  transform: rotate(-90deg);
}
</style>
