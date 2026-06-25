<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

defineProps<{
  title: string;
  icon: unknown;
  count?: number;
  open?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    class="flex h-8 min-h-8 max-h-8 items-center justify-center gap-1.5 rounded-(--radius-sm) border border-black/8 bg-white pl-3 pr-2 py-1.5 transition-colors hover:bg-(--muted) cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--primary)"
  >
    <component :is="icon" class="size-4 flex-shrink-0 text-[rgba(48,48,50,0.68)]" />

    <span class="select-none text-sm leading-5 font-medium text-[#18181B]">
      {{ title }}
    </span>

    <span
      v-if="count"
      class="flex size-4 items-center justify-center rounded-full bg-[#18181B] text-[10px] font-medium text-white"
    >
      {{ count }}
    </span>

    <ChevronDown
      class="size-4 flex-shrink-0 text-[rgba(48,48,50,0.98)] transition-transform duration-200"
      :class="{ 'rotate-180': open }"
    />
  </button>
</template>
