<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed } from 'vue';

import AppFilterTrigger from './AppFilterTrigger.vue';
import type { AppFilterSingleProps } from './model/types';

const props = defineProps<AppFilterSingleProps>();

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const selectedLabel = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)?.label;
});
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <AppFilterTrigger
        :title="selectedLabel || title"
        :icon="icon"
        :clearable="!!modelValue"
        @clear="emit('update:modelValue', '')"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="4"
        class="w-53 rounded-xl bg-(--surface) p-1 shadow-(--shadow-panel)"
      >
        <DropdownMenuRadioGroup
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        >
          <DropdownMenuRadioItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="flex h-8 cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 outline-none hover:bg-(--muted) data-highlighted:bg-(--muted)"
          >
            <span class="text-sm font-medium text-(--text-primary)">
              {{ option.label }}
            </span>

            <Check v-if="modelValue === option.value" class="size-4 text-(--text-secondary)" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
