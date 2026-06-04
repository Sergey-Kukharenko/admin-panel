<script setup lang="ts">
import { computed } from 'vue';

import type { AppButtonProps } from './AppButton.types';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
});

const classes = computed(
  () =>
    ({
      primary: ['bg-black', 'text-white', 'hover:opacity-90'],
      secondary: [
        'bg-[var(--color-muted)]',
        'text-[var(--color-foreground)]',
        'hover:bg-[var(--color-muted-hover)]',
      ],
    })[props.variant],
);
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="[
      'inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-medium transition-colors',
      classes,
    ]"
  >
    <slot />
  </button>
</template>
