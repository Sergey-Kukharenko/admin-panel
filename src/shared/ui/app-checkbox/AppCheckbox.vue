<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue';

import { AppIcon } from '@/shared/ui/app-icon';

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

// UI kit _CheckboxControl 52:781, 16px, radius 6. The states come from radix data attributes and
// pseudo-classes, not from props, so the groups are static. The checked fill is bg/accent or the
// `color` prop (set as --app-checkbox-checked on the element)
const boxClasses = [
  // base: the unselected box, bg/input with an inside border/default stroke
  'relative flex size-4 shrink-0 items-center justify-center rounded-(--radius-md) outline-none',
  'bg-(--bg-input) ring-1 ring-(--border-default) ring-inset',
  'transition-colors duration-150',
  '[--app-checkbox-checked:var(--bg-accent)]',
  // unselected: hover and keyboard focus bg/input-hover, pressed a 2px border/accent stroke
  'data-[state=unchecked]:hover:bg-(--bg-input-hover)',
  'data-[state=unchecked]:active:ring-2 data-[state=unchecked]:active:ring-(--border-accent)',
  'data-[state=unchecked]:focus-visible:bg-(--bg-input-hover) data-[state=unchecked]:focus-visible:ring-0',
  // selected: the fill with shadow-field, no stroke; hover and pressed add a 14% black layer
  'data-[state=checked]:bg-(--app-checkbox-checked) data-[state=checked]:shadow-(--shadow-field) data-[state=checked]:ring-0',
  'data-[state=checked]:hover:bg-(image:--bg-checkbox-checked-hover)',
  'data-[state=checked]:active:bg-(image:--bg-checkbox-checked-hover)',
  // focus: the 4px border/accent ring of the UI kit checkbox (not the grey one of the buttons)
  'focus-visible:shadow-(--shadow-focus-accent) data-[state=checked]:focus-visible:shadow-(--shadow-focus-accent)',
  // disabled: the same look at 50%
  'disabled:pointer-events-none disabled:opacity-50 disabled:ring-0',
];
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
      :style="color ? { '--app-checkbox-checked': color } : undefined"
      :class="boxClasses"
      @update:checked="(value) => emit('update:modelValue', !!value)"
    >
      <CheckboxIndicator class="flex items-center justify-center text-(--icon-on-dark)">
        <AppIcon name="check-2" class="size-3" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <!-- Legend Item label: body/sm medium, text/primary -->
    <span
      v-if="$slots.default"
      class="text-body-sm font-medium select-none"
      :class="disabled ? 'text-(--text-tertiary)' : 'text-(--text-primary)'"
    >
      <slot />
    </span>
  </label>
</template>
