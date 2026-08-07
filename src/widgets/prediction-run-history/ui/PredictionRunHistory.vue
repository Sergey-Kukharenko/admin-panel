<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { computed } from 'vue';

import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

import chevronDownIcon from '../assets/icons/chevron-down.svg';
import { useRunHistoryTable } from '../model/useRunHistoryTable';
import PredictionRunHistoryEmptyState from './PredictionRunHistoryEmptyState.vue';
import PredictionRunHistoryErrorState from './PredictionRunHistoryErrorState.vue';
import PredictionRunHistorySkeleton from './PredictionRunHistorySkeleton.vue';
import PredictionRunHistoryTable from './PredictionRunHistoryTable.vue';

defineOptions({
  name: 'PredictionRunHistory',
});

const {
  records,
  hasData,
  isLoading,
  isError,
  refetch,
  selectedProductId,
  selectedProductName,
  productOptions,
  downloadRecord,
} = useRunHistoryTable();

const showDropdown = computed(() => !isLoading.value && !isError.value && hasData.value);
</script>

<template>
  <section class="flex w-full flex-1 flex-col items-start gap-4 pt-3">
    <header class="flex w-full items-center justify-between">
      <h2 class="text-lg font-medium leading-6 text-(--text-primary)">История результатов</h2>

      <AppDropdown v-if="showDropdown" align="end">
        <template #trigger>
          <button
            type="button"
            class="flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-(--border-default) px-3 py-1.5 transition-colors hover:bg-(--muted-hover)"
          >
            <span class="text-sm font-medium leading-5 text-[#18181b]">
              {{ selectedProductName || 'Все продукты' }}
            </span>
            <span class="relative flex size-4 shrink-0 items-center justify-center overflow-hidden">
              <img :src="chevronDownIcon" alt="" class="h-[9.546px] w-[5.834px] rotate-90" />
            </span>
          </button>
        </template>

        <AppDropdownItem @select="selectedProductId = ''">
          <span class="flex-1 text-sm font-medium text-(--text-primary)">Все продукты</span>
          <Check v-if="!selectedProductId" class="size-4 shrink-0 text-(--text-secondary)" />
        </AppDropdownItem>

        <AppDropdownItem
          v-for="product in productOptions"
          :key="product.id"
          @select="selectedProductId = product.id"
        >
          <span class="flex-1 truncate text-sm font-medium text-(--text-primary)">
            {{ product.name }}
          </span>
          <Check
            v-if="selectedProductId === product.id"
            class="size-4 shrink-0 text-(--text-secondary)"
          />
        </AppDropdownItem>
      </AppDropdown>
    </header>

    <PredictionRunHistorySkeleton v-if="isLoading" />
    <PredictionRunHistoryErrorState v-else-if="isError" @retry="refetch" />
    <PredictionRunHistoryTable v-else-if="hasData" :items="records" @download="downloadRecord" />
    <PredictionRunHistoryEmptyState v-else />
  </section>
</template>
