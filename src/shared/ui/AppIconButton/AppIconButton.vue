<script setup lang="ts">
import { computed } from 'vue';

export interface AppIconButtonProps {
  variant?: 'ghost' | 'outline';
  disabled?: boolean;
}

defineOptions({
  name: 'AppIconButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppIconButtonProps>(), {
  variant: 'ghost',
  disabled: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return ['border', 'border-(--border)', 'bg-white', 'hover:bg-(--muted)'];

    case 'ghost':
    default:
      return ['bg-transparent', 'hover:bg-(--muted)'];
  }
});
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center',
      'size-8',
      'rounded-(--radius-sm)',
      'transition-colors duration-150',
      'disabled:pointer-events-none',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>
