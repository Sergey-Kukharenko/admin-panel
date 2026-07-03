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
}>();

defineEmits<{
  click: [];
}>();

const STATUS_CONFIG = {
  loading: {
    text: 'Загрузка',
    icon: Loader2,
    bg: 'bg-[rgba(202,220,255,0.40)]',
    color: 'text-[#1A0151]',
    animate: true,
  },
  success: {
    text: 'Успешно',
    icon: Check,
    bg: 'bg-[var(--color-green-100)]',
    color: 'text-[var(--success)]',
    animate: false,
  },
  error: {
    text: 'Ошибка',
    icon: CircleAlert,
    bg: 'bg-[var(--color-red-200)]/40',
    color: 'text-[var(--danger)]',
    animate: false,
  },
} as const;

const config = computed(() => STATUS_CONFIG[props.status]);
</script>

<template>
  <div
    class="inline-flex h-[23px] items-center gap-1 rounded-full px-2 select-none transition-all"
    :class="[config.bg, clickable && 'cursor-pointer hover:bg-opacity-80 active:scale-95']"
    @click="$emit('click')"
  >
    <component
      :is="config.icon"
      class="size-[14px]"
      :class="[config.color, config.animate && 'animate-spin']"
      :stroke-width="2.5"
    />

    <span class="text-xs font-medium uppercase" :class="config.color">
      {{ config.text }}
    </span>
  </div>
</template>
