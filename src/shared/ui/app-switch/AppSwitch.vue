<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue';

import type { AppSwitchProps } from './AppSwitch.types';

defineOptions({
  name: 'AppSwitch',
  inheritAttrs: false,
});

withDefaults(defineProps<AppSwitchProps>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();
</script>

<template>
  <SwitchRoot
    v-bind="$attrs"
    :checked="modelValue"
    :disabled="disabled"
    class="relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-(--radius-full) outline-none transition-colors duration-150 ease-in-out bg-(--muted) hover:bg-(--muted-hover) active:bg-[#e1e1e2] active:opacity-80 focus-visible:ring-4 focus-visible:ring-(--border-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-primary) disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-(--bg-accent) data-[state=checked]:hover:bg-(--bg-accent-hover) data-[state=checked]:disabled:bg-(--bg-tag-active)"
    @update:checked="(value) => emit('update:modelValue', !!value)"
  >
    <SwitchThumb
      class="pointer-events-none absolute left-0.5 size-4 rounded-(--radius-full) bg-(--bg-surface-primary) shadow-(--shadow-field) transition-transform duration-150 ease-in-out data-[state=checked]:translate-x-3 data-[state=checked]:bg-(--text-inverse-soft) data-[state=checked]:shadow-(--shadow-switch)"
    />
  </SwitchRoot>
</template>
