<script setup lang="ts">
import { computed } from 'vue';

export interface AppButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium';
  disabled?: boolean;
}

defineOptions({
  name: 'AppButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return [
        'bg-(--color-neutral-100) text-(--foreground)',
        'hover:bg-(--color-neutral-200)',
        'active:bg-(--color-neutral-300)',
        'disabled:text-(--color-neutral-400) disabled:bg-transparent',
      ];
    case 'outline':
      return [
        'border border-(--border) bg-transparent text-(--foreground)',
        'hover:border-(--color-neutral-700)',
        'active:border-(--color-neutral-900) active:bg-(--color-neutral-100)',
        'disabled:border-(--color-neutral-200) disabled:text-(--color-neutral-400)',
      ];
    case 'ghost':
      return [
        'bg-transparent text-(--foreground)',
        'hover:bg-(--color-neutral-100)',
        'active:bg-(--color-neutral-200)',
        'disabled:text-(--color-neutral-400)',
      ];
    case 'danger':
      return [
        'bg-(--danger) text-(--primary-foreground)',
        'hover:opacity-90',
        'active:opacity-100',
        'disabled:bg-(--color-red-200) disabled:text-(--color-neutral-400)',
      ];
    case 'primary':
    default:
      return [
        'bg-(--primary) text-(--primary-foreground)',
        'hover:bg-(--color-neutral-800)',
        'active:bg-(--color-neutral-950)',
        'disabled:bg-(--color-neutral-200) disabled:text-(--color-neutral-400)',
      ];
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-8 px-3 text-sm gap-2';
    case 'medium':
    default:
      return 'h-9 px-4 text-sm gap-3';
  }
});
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-(--radius-md) font-medium select-none',
      'transition-colors duration-150 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-focus)',
      'disabled:pointer-events-none',
      sizeClasses,
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>
