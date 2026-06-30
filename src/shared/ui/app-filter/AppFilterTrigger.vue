<script setup lang="ts">
import { ChevronDown, X } from 'lucide-vue-next';

defineProps<{
  title: string;
  icon: unknown;
  count?: number;
  clearable?: boolean;
}>();

const emit = defineEmits<{
  clear: [];
}>();

function onClear(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  emit('clear');
}
</script>

<template>
  <button
    type="button"
    class="flex h-8 min-h-8 max-h-8 items-center justify-center gap-1.5 rounded-(--radius-sm) border border-black/8 bg-white pl-3 pr-2 py-1.5 transition-colors hover:bg-(--muted)"
  >
    <component :is="icon" class="size-4 shrink-0 text-[rgba(48,48,50,0.68)]" />

    <span class="select-none text-sm font-medium leading-5 text-[#18181B]">
      {{ title }}
    </span>

    <span
      v-if="count"
      class="flex size-4 items-center justify-center rounded-full bg-[#18181B] text-[10px] font-medium text-white"
    >
      {{ count }}
    </span>

    <span v-if="clearable" class="flex cursor-pointer items-center justify-center" @click="onClear">
      <X class="size-4 text-[rgba(48,48,50,0.68)]" />
    </span>

    <ChevronDown v-else class="size-4 text-[rgba(48,48,50,0.98)]" />
  </button>
</template>
