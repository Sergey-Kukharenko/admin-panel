<script setup lang="ts">
import type { IconName } from '@/shared/ui/app-icon';

import AppFilterMultiple from './AppFilterMultiple.vue';
import AppFilterSingle from './AppFilterSingle.vue';
import type { FilterOption } from './model/types';

defineProps<{
  multiple?: boolean;
  title: string;
  icon: IconName;
  options: readonly FilterOption[];
  modelValue?: string | string[];
}>();

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
    :model-value="modelValue as string[]"
    @update:model-value="emit('update:modelValue', $event)"
  />

  <AppFilterSingle
    v-else
    :title="title"
    :icon="icon"
    :options="options"
    :model-value="modelValue as string"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
