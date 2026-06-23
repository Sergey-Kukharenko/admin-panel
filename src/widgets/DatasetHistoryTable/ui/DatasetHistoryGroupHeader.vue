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
    class="flex w-full px-6 py-3 items-center gap-3 bg-transparent hover:bg-[rgba(48,48,50,0.02)] transition-colors text-left rounded-xl focus-visible:outline-none"
    @click="$emit('toggle')"
  >
    <div class="flex items-center gap-2 shrink-0">
      <ChevronDown
        :class="[
          'size-4 text-[rgba(48,48,50,0.98)] transition-transform duration-200',
          { '-rotate-90': !expanded },
        ]"
        stroke-width="2.5"
      />
    </div>

    <span class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none flex-1">
      {{ date }}
    </span>

    <div class="flex items-center gap-1 shrink-0">
      <div
        class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)]"
      >
        <PieChart class="size-[14px] text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
        <div class="flex pl-[2px] justify-center items-center gap-1">
          <span
            class="font-mono text-xs font-medium text-[rgba(48,48,50,0.98)] leading-5 uppercase select-none"
          >
            {{ uploadedCount }}/{{ totalCount }}
          </span>
        </div>
      </div>

      <div
        class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-0.5 rounded-full bg-[rgba(48,48,50,0.06)]"
      >
        <FileText class="size-[14px] text-[rgba(48,48,50,0.98)] flex-shrink-0" stroke-width="2" />
        <div class="flex pl-[2px] justify-center items-center gap-1">
          <span
            class="font-mono text-xs font-medium text-[rgba(48,48,50,0.98)] leading-5 uppercase select-none"
          >
            Источник:{{ source }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>
