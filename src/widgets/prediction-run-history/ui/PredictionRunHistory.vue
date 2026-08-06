<script setup lang="ts">
import { computed } from 'vue';

import chevronDownIcon from '../assets/icons/chevron-down.svg';
import type { PredictionRunRecord } from '../model/types';
import PredictionRunHistoryEmptyState from './PredictionRunHistoryEmptyState.vue';
import PredictionRunHistoryTable from './PredictionRunHistoryTable.vue';

defineOptions({
  name: 'PredictionRunHistory',
});

const props = defineProps<{
  items: PredictionRunRecord[];
}>();

defineEmits<{
  download: [item: PredictionRunRecord];
}>();

const hasData = computed(() => props.items.length > 0);
</script>

<template>
  <section class="flex w-full flex-1 flex-col items-start gap-4 pt-3">
    <header class="flex w-full items-center justify-between">
      <h2 class="text-lg font-medium leading-6 text-(--text-primary)">История результатов</h2>

      <div
        class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-(--border-default) px-3 py-1.5 transition-opacity"
        :class="hasData ? 'opacity-100' : 'opacity-0'"
        :aria-hidden="!hasData"
      >
        <span class="text-sm font-medium leading-5 text-[#18181b]">Все продукты</span>
        <span class="relative flex size-4 shrink-0 items-center justify-center overflow-hidden">
          <img :src="chevronDownIcon" alt="" class="h-[9.546px] w-[5.834px] rotate-90" />
        </span>
      </div>
    </header>

    <PredictionRunHistoryTable
      v-if="hasData"
      :items="items"
      @download="(item) => $emit('download', item)"
    />
    <PredictionRunHistoryEmptyState v-else />
  </section>
</template>
