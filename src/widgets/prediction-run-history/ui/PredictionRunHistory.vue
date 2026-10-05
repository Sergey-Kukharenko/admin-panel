<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppPagination } from '@/shared/ui/app-pagination';

import { RUN_HISTORY_PAGE_SIZE } from '../model/useRunHistoryFilters';
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
  totalCount,
  page,
  sortField,
  sortOrder,
  toggleSort,
  hasData,
  isLoading,
  isError,
  refetch,
  selectedProductId,
  selectedProductName,
  productOptions,
  downloadRecord,
} = useRunHistoryTable();

const { t } = useI18n({ useScope: 'global' });

const showDropdown = computed(() => !isLoading.value && !isError.value && hasData.value);
</script>

<template>
  <TooltipProvider :delay-duration="100">
    <section class="flex w-full flex-1 flex-col items-start gap-4 pt-3">
      <header class="flex w-full items-center justify-between">
        <h2 class="text-lg font-medium leading-6 text-(--text-primary)">
          {{ t('predictions.history.title') }}
        </h2>

        <AppDropdown v-if="showDropdown" align="end">
          <template #trigger>
            <button
              type="button"
              class="group flex h-8 max-h-8 min-h-8 items-center justify-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) px-3 py-1.5 transition-colors hover:bg-(--muted-hover)"
            >
              <span class="text-sm font-medium leading-5 text-[#18181b]">
                {{ selectedProductName || t('predictions.history.allProducts') }}
              </span>
              <!-- data-state="open" ставит DropdownMenuTrigger (as-child) -->
              <AppIcon
                name="large-line-arrow-down"
                class="size-4 text-(--text-primary) group-data-[state=open]:hidden"
              />
              <AppIcon
                name="large-line-arrow-up"
                class="hidden size-4 text-(--text-primary) group-data-[state=open]:block"
              />
            </button>
          </template>

          <AppDropdownItem @select="selectedProductId = ''">
            <span class="flex-1 text-sm font-medium text-(--text-primary)">
              {{ t('predictions.history.allProducts') }}
            </span>
            <AppIcon
              v-if="!selectedProductId"
              name="check-line"
              class="size-4 shrink-0 text-(--text-secondary)"
            />
          </AppDropdownItem>

          <AppDropdownItem
            v-for="product in productOptions"
            :key="product.id"
            @select="selectedProductId = product.id"
          >
            <span class="flex-1 truncate text-sm font-medium text-(--text-primary)">
              {{ product.name }}
            </span>
            <AppIcon
              v-if="selectedProductId === product.id"
              name="check-line"
              class="size-4 shrink-0 text-(--text-secondary)"
            />
          </AppDropdownItem>
        </AppDropdown>
      </header>

      <PredictionRunHistorySkeleton v-if="isLoading" />
      <PredictionRunHistoryErrorState v-else-if="isError" @retry="refetch" />
      <template v-else-if="hasData">
        <PredictionRunHistoryTable
          :items="records"
          :sort-field="sortField"
          :sort-order="sortOrder"
          @sort="toggleSort"
          @download="downloadRecord"
        />

        <AppPagination
          v-model:page="page"
          :total-items="totalCount"
          :page-size="RUN_HISTORY_PAGE_SIZE"
        />
      </template>
      <PredictionRunHistoryEmptyState v-else />
    </section>
  </TooltipProvider>
</template>
