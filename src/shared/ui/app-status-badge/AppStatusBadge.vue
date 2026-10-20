<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppIcon, type IconName } from '@/shared/ui/app-icon';

import type { AppStatusBadgeStatus } from './AppStatusBadge.types';

const props = defineProps<{
  status: AppStatusBadgeStatus;
  /** Overrides the default text for contexts with their own status wording */
  label?: string;
  /** Overrides the default icon of the tone (e.g. "awaiting" and "generating" are both neutral) */
  icon?: IconName;
}>();

const { t } = useI18n({ useScope: 'global' });

// Figma StatusBadge (UI kit): fill, text and icon colors per tone. Icon-to-text space is 4px in
// every tone (the neutral variant draws it as a 2px gap plus 2px padding)
const STATUS_CONFIG = {
  neutral: {
    labelKey: 'common.statusBadge.neutral',
    icon: 'progress-2-line',
    classes: 'bg-(--bg-badge-neutral) text-(--text-primary)',
  },
  loading: {
    labelKey: 'common.statusBadge.loading',
    icon: 'loader-2-line',
    classes: 'bg-(--bg-badge-loading) text-(--icon-loading)',
  },
  success: {
    labelKey: 'common.statusBadge.success',
    icon: 'checkbox-circle-line',
    classes: 'bg-(--bg-badge-success) text-(--text-success-alt)',
  },
  error: {
    labelKey: 'common.statusBadge.error',
    icon: 'close-circle-line',
    classes: 'bg-(--bg-danger) text-(--text-error)',
  },
} as const satisfies Record<
  AppStatusBadgeStatus,
  { labelKey: string; icon: IconName; classes: string }
>;

const config = computed(() => STATUS_CONFIG[props.status]);
const iconName = computed<IconName>(() => props.icon ?? config.value.icon);
// The loader always spins: Figma cannot show motion, and a still loader reads as a hung page
// (results "Generating" is a neutral badge with the loader icon)
const spinning = computed(() => iconName.value === 'loader-2-line');
</script>

<template>
  <span
    class="inline-flex h-5.75 items-center gap-1 rounded-(--radius-full) pr-2 pl-1.5 font-mono text-element-tag font-medium uppercase select-none"
    :class="config.classes"
  >
    <AppIcon :name="iconName" class="size-3.5 shrink-0" :class="spinning && 'animate-spin'" />
    {{ label ?? t(config.labelKey) }}
  </span>
</template>
