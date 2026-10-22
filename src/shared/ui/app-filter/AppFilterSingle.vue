<script setup lang="ts">
import { DropdownMenuRadioGroup } from 'radix-vue';
import { computed } from 'vue';

import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';

import AppFilterTrigger from './AppFilterTrigger.vue';
import type { AppFilterSingleProps } from './model/types';

// clearable defaults to true in AppFilter, the only consumer
const props = defineProps<AppFilterSingleProps>();

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const selectedLabel = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)?.label;
});
</script>

<template>
  <!-- The menu of the UI kit Filter is the base dropdown panel, 212px wide, under the left edge -->
  <AppDropdown align="start" content-class="w-53 gap-1 p-1">
    <template #trigger>
      <AppFilterTrigger
        :disabled="disabled"
        :title="selectedLabel || title"
        :icon="icon"
        :clearable="clearable && !!modelValue"
        @clear="emit('update:modelValue', '')"
      />
    </template>

    <DropdownMenuRadioGroup
      :model-value="modelValue"
      class="flex flex-col gap-1"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <AppDropdownItem
        v-for="option in options"
        :key="option.value"
        type="radio"
        :value="option.value"
        class="justify-between"
      >
        <span class="text-body-sm font-medium text-(--text-primary)">
          {{ option.label }}
        </span>

        <AppIcon
          v-if="modelValue === option.value"
          name="check-line"
          class="size-4 text-(--text-secondary)"
        />
      </AppDropdownItem>
    </DropdownMenuRadioGroup>
  </AppDropdown>
</template>
