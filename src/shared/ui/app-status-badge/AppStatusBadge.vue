<script setup lang="ts">
import { computed } from 'vue';

import { AppIcon } from '@/shared/ui/app-icon';

import type { AppStatusBadgeStatus } from './AppStatusBadge.types';

defineOptions({
  name: 'AppStatusBadge',
});

const props = defineProps<{
  status: AppStatusBadgeStatus;
  /** Переопределяет текст по умолчанию для контекстов со своей терминологией статусов */
  label?: string;
}>();

// Цвета взяты из макетов (Figma) под соответствующие статусы — bg-badge-*/icon-*
// токены под это уже были в дизайн-системе, просто не использовались здесь
const STATUS_CONFIG = {
  loading: {
    text: 'Загрузка',
    icon: 'loader-2-line',
    bg: 'bg-(--bg-badge-loading)',
    color: 'text-(--icon-loading)',
    animate: true,
  },
  success: {
    text: 'Успешно',
    icon: 'checkbox-circle-line',
    bg: 'bg-(--bg-badge-success)',
    color: 'text-(--icon-success-alt)',
    animate: false,
  },
  error: {
    text: 'Ошибка',
    icon: 'close-circle-line',
    bg: 'bg-(--bg-badge-danger)',
    color: 'text-(--icon-error)',
    animate: false,
  },
} as const;

const config = computed(() => STATUS_CONFIG[props.status]);
</script>

<template>
  <span
    class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) px-2 select-none"
    :class="config.bg"
  >
    <AppIcon
      :name="config.icon"
      class="size-3.5"
      :class="[config.color, config.animate && 'animate-spin']"
    />

    <span class="text-xs font-medium uppercase" :class="config.color">
      {{ label ?? config.text }}
    </span>
  </span>
</template>
