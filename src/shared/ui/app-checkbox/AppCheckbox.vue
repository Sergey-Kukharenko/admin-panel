<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue';

import type { AppCheckboxProps } from './AppCheckbox.types';

defineOptions({
  name: 'AppCheckbox',
  inheritAttrs: false,
});

withDefaults(defineProps<AppCheckboxProps>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();
</script>

<template>
  <label
    class="inline-flex items-center gap-2"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <CheckboxRoot
      v-bind="$attrs"
      :checked="modelValue"
      :disabled="disabled"
      class="relative flex size-4 shrink-0 items-center justify-center rounded-[6px] border border-(--border-default) bg-(--muted) outline-none transition-colors duration-150 ease-in-out hover:bg-(--muted-hover) active:border-2 active:border-(--border-accent) focus-visible:ring-4 focus-visible:ring-(--border-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-primary) disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:border-transparent data-[state=checked]:bg-(--bg-accent) data-[state=checked]:shadow-(--shadow-field) data-[state=checked]:hover:bg-(--bg-accent-hover)"
      @update:checked="(value) => emit('update:modelValue', !!value)"
    >
      <CheckboxIndicator class="flex items-center justify-center text-(--bg-surface-primary)">
        <Check class="size-2.5" :stroke-width="3" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <span
      v-if="$slots.default"
      class="text-sm font-medium select-none"
      :class="disabled ? 'text-(--text-tertiary)' : 'text-(--text-primary)'"
    >
      <slot />
    </span>
  </label>
</template>
