<script setup lang="ts">
import type { IconName } from '@/shared/ui/app-icon';

import AppFilterMultiple from './AppFilterMultiple.vue';
import AppFilterSingle from './AppFilterSingle.vue';
import type { FilterOption } from './model/types';

withDefaults(
  defineProps<{
    multiple?: boolean;
    title: string;
    icon?: IconName;
    options: readonly FilterOption[];
    modelValue?: string | string[];
    /** Single filter: reset cross while a value is selected */
    clearable?: boolean;
    disabled?: boolean;
  }>(),
  {
    multiple: false,
    disabled: false,
    clearable: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [string | string[]];
}>();
</script>

<template>
  <AppFilterMultiple
    v-if="multiple"
    :title="title"
    :icon="icon"
    :options="options"
    :disabled="disabled"
    :model-value="modelValue as string[]"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <AppFilterSingle
    v-else
    :title="title"
    :icon="icon"
    :options="options"
    :disabled="disabled"
    :model-value="modelValue as string"
    :clearable="clearable"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
