<script setup lang="ts">
import { Check, CircleAlert, Loader2 } from 'lucide-vue-next';
import { computed } from 'vue';

import type { AppStatusBadgeStatus } from './model/types';

defineOptions({
  name: 'AppStatusBadge',
});

const props = defineProps<{
  status: AppStatusBadgeStatus;
  clickable?: boolean;
  /** Переопределяет текст по умолчанию для контекстов со своей терминологией статусов */
  label?: string;
}>();

defineEmits<{
  click: [];
}>();

// Цвета взяты из макетов (Figma) под соответствующие статусы — bg-badge-*/icon-*
// токены под это уже были в дизайн-системе, просто не использовались здесь
const STATUS_CONFIG = {
  loading: {
    text: 'Загрузка',
    icon: Loader2,
    bg: 'bg-(--bg-badge-loading)',
    color: 'text-(--icon-loading)',
    animate: true,
  },
  success: {
    text: 'Успешно',
    icon: Check,
    bg: 'bg-(--bg-badge-success)',
    color: 'text-(--icon-success-alt)',
    animate: false,
  },
  error: {
    text: 'Ошибка',
    icon: CircleAlert,
    bg: 'bg-(--bg-badge-danger)',
    color: 'text-(--icon-error)',
    animate: false,
  },
} as const;

const config = computed(() => STATUS_CONFIG[props.status]);
</script>

<template>
  <div
    class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) px-2 select-none transition-all"
    :class="[config.bg, clickable && 'cursor-pointer hover:bg-opacity-80 active:scale-95']"
    @click="$emit('click')"
  >
    <component
      :is="config.icon"
      class="size-3.5"
      :class="[config.color, config.animate && 'animate-spin']"
      :stroke-width="2.5"
    />

    <span class="text-xs font-medium uppercase" :class="config.color">
      {{ label ?? config.text }}
    </span>
  </div>
</template>
