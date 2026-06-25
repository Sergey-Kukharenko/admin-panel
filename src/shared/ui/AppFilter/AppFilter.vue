<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed } from 'vue';

import type { AppFilterProps, FilterOption } from './model/types';

defineOptions({
  name: 'AppFilter',
});

const props = withDefaults(
  defineProps<
    AppFilterProps & {
      modelValue?: string | string[];
    }
  >(),
  {
    multiple: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]];
}>();

const selectedCount = computed(() => {
  if (!props.multiple) {
    return props.modelValue ? 1 : 0;
  }

  return Array.isArray(props.modelValue) ? props.modelValue.length : 0;
});

function isSelected(value: string) {
  if (!props.multiple) {
    return props.modelValue === value;
  }

  return Array.isArray(props.modelValue) && props.modelValue.includes(value);
}

function toggle(option: FilterOption) {
  if (!props.multiple) {
    emit('update:modelValue', option.value);
    return;
  }

  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];

  const exists = current.includes(option.value);

  emit(
    'update:modelValue',
    exists ? current.filter((v) => v !== option.value) : [...current, option.value],
  );
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="flex h-8 min-h-8 max-h-8 items-center justify-center gap-1.5 rounded-lg border border-black/8 bg-[rgba(48,48,50,0.06)] px-3 py-1.5 transition-colors hover:bg-[rgba(48,48,50,0.08)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <component :is="icon" class="size-4 text-[rgba(48,48,50,0.68)]" />

        <span class="text-sm font-medium leading-5 text-[rgba(48,48,50,0.98)]">
          {{ title }}
        </span>

        <span
          v-if="multiple && selectedCount"
          class="flex size-4 items-center justify-center rounded-full bg-[#18181B] text-[10px] font-medium text-white"
        >
          {{ selectedCount }}
        </span>

        <ChevronDown class="size-4 text-[rgba(48,48,50,0.98)]" />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="4"
        class="w-[212px] rounded-xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_-6px_12px_rgba(0,0,0,0.03),0_14px_28px_rgba(0,0,0,0.08)] backdrop-blur-[20px]"
      >
        <DropdownMenuRadioGroup v-if="!multiple" :model-value="modelValue as string">
          <DropdownMenuRadioItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 outline-none hover:bg-[rgba(48,48,50,0.06)] data-[highlighted]:bg-[rgba(48,48,50,0.06)]"
            @select.prevent="toggle(option)"
          >
            <span class="text-sm font-medium leading-5 text-[rgba(48,48,50,0.98)]">
              {{ option.label }}
            </span>

            <Check v-if="isSelected(option.value)" class="size-4 text-[rgba(48,48,50,0.68)]" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <template v-else>
          <DropdownMenuCheckboxItem
            v-for="option in options"
            :key="option.value"
            :checked="isSelected(option.value)"
            class="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 outline-none hover:bg-[rgba(48,48,50,0.06)] data-[highlighted]:bg-[rgba(48,48,50,0.06)]"
            @select.prevent="toggle(option)"
          >
            <span class="text-sm font-medium leading-5 text-[rgba(48,48,50,0.98)]">
              {{ option.label }}
            </span>

            <Check v-if="isSelected(option.value)" class="size-4 text-[rgba(48,48,50,0.68)]" />
          </DropdownMenuCheckboxItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
