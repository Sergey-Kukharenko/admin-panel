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
        class="w-[212px] rounded-xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)]"
      >
        <DropdownMenuRadioGroup
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        >
          <DropdownMenuRadioItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="flex h-8 cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 outline-none hover:bg-[rgba(48,48,50,0.06)] data-[highlighted]:bg-[rgba(48,48,50,0.06)]"
          >
            <span class="text-sm font-medium text-[rgba(48,48,50,0.98)]">
              {{ option.label }}
            </span>

            <Check v-if="modelValue === option.value" class="size-4 text-[rgba(48,48,50,0.68)]" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
