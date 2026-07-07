<script setup lang="ts">
import { ChevronDown, FileText, PieChart } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryGroupHeader',
});

defineProps<{
  date: string;
  uploadedCount: number;
  totalCount: number;
  source: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    type="button"
    class="flex gap-3 h-12 w-full items-center bg-transparent px-6 text-left focus-visible:outline-none"
    @click="$emit('toggle')"
  >
    <div class="flex min-w-0 items-center gap-3">
      <div class="flex shrink-0 items-center gap-2">
        <ChevronDown
          :class="[
            'size-4 text-[rgba(48,48,50,0.98)] transition-transform duration-200',
            { '-rotate-90': !expanded },
          ]"
          stroke-width="2.5"
        />
      </div>
      <span class="truncate text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none">
        {{ date }}
      </span>
    </div>

    <div class="flex gap-1">
      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)] pl-1.5 pr-2 py-1 select-none"
        >
          <PieChart class="size-3.5 shrink-0 text-[rgba(48,48,50,0.98)]" stroke-width="2" />
          <span
            class="font-mono text-xs font-medium uppercase text-[rgba(48,48,50,0.98)] leading-5 pl-0.5"
          >
            {{ uploadedCount }}/{{ totalCount }}
          </span>
        </div>
      </div>

      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)] pl-1.5 pr-2 py-1 select-none"
        >
          <FileText class="size-3.5 shrink-0 text-[rgba(48,48,50,0.98)]" stroke-width="2" />
          <span
            class="font-mono text-xs font-medium uppercase text-[rgba(48,48,50,0.98)] leading-5 pl-0.5"
          >
            Источник:{{ source }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>
