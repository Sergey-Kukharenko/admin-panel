<script setup lang="ts">
import { computed } from 'vue';

import type { AppButtonProps } from './AppButton.types';

defineOptions({
  name: 'AppButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return ['bg-[var(--muted)]', 'text-[var(--foreground)]', 'hover:bg-[var(--muted-hover)]'];

    default:
      return ['bg-[var(--foreground)]', 'text-white', 'hover:opacity-90'];
  }
});
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="[
      'inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>
