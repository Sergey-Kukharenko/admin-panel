<script setup lang="ts">
import { computed } from 'vue';

import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';

import AppFilterTrigger from './AppFilterTrigger.vue';
import type { AppFilterMultipleProps } from './model/types';

const props = defineProps<AppFilterMultipleProps>();

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

const count = computed(() => props.modelValue?.length ?? 0);

function toggle(value: string) {
  const current = props.modelValue ?? [];

  const exists = current.includes(value);

  emit('update:modelValue', exists ? current.filter((v) => v !== value) : [...current, value]);
}
</script>

<template>
  <!-- The menu of the UI kit Filter is the base dropdown panel, 212px wide, under the left edge -->
  <AppDropdown align="start" content-class="w-53 gap-1 p-1">
    <template #trigger>
      <AppFilterTrigger
        :disabled="disabled"
        :title="title"
        :icon="icon"
        :count="count"
        :clearable="count > 0"
        @clear="emit('update:modelValue', [])"
      />
    </template>

    <!-- select.prevent keeps the menu open: several types are picked in one go -->
    <AppDropdownItem
      v-for="option in options"
      :key="option.value"
      type="checkbox"
      :checked="modelValue?.includes(option.value)"
      class="justify-between"
      @select.prevent="toggle(option.value)"
    >
      <span class="text-body-sm font-medium text-(--text-primary)">
        {{ option.label }}
      </span>

      <AppIcon
        v-if="modelValue?.includes(option.value)"
        name="check-line"
        class="size-4 text-(--text-secondary)"
      />
    </AppDropdownItem>
  </AppDropdown>
</template>
