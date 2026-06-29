<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed } from 'vue';

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
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <AppFilterTrigger
        :title="title"
        :icon="icon"
        :count="count"
        :clearable="count > 0"
        @clear="emit('update:modelValue', [])"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="4"
        align="start"
        class="w-[212px] rounded-xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)]"
      >
        <DropdownMenuCheckboxItem
          v-for="option in options"
          :key="option.value"
          :checked="modelValue?.includes(option.value)"
          class="flex h-8 items-center justify-between rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-[rgba(48,48,50,0.06)] data-[highlighted]:bg-[rgba(48,48,50,0.06)]"
          @select.prevent="toggle(option.value)"
        >
          <span class="text-sm font-medium text-[rgba(48,48,50,0.98)]">
            {{ option.label }}
          </span>

          <Check
            v-if="modelValue?.includes(option.value)"
            class="size-4 text-[rgba(48,48,50,0.68)]"
          />
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
