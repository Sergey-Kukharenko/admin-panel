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
        class="w-53 rounded-xl bg-(--surface) p-1 shadow-(--shadow-panel)"
      >
        <DropdownMenuCheckboxItem
          v-for="option in options"
          :key="option.value"
          :checked="modelValue?.includes(option.value)"
          class="flex h-8 items-center justify-between rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-(--muted) data-highlighted:bg-(--muted)"
          @select.prevent="toggle(option.value)"
        >
          <span class="text-sm font-medium text-(--text-primary)">
            {{ option.label }}
          </span>

          <Check v-if="modelValue?.includes(option.value)" class="size-4 text-(--text-secondary)" />
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
