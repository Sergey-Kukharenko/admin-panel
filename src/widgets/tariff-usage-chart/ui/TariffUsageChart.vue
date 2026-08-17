<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed, ref } from 'vue';

import { TARIFF_CHART_MAX_VALUE, TARIFF_MONTHLY_USAGE, TARIFF_USAGE_LIMITS } from '@/entities/tariff';
import AppCard from '@/shared/ui/app-card';

import { UsageBarChart } from './usage-bar-chart';

defineOptions({
  name: 'TariffUsageChart',
});

const selectedProductId = ref(TARIFF_USAGE_LIMITS[0]?.productId ?? '');

const selectedProductName = computed(
  () =>
    TARIFF_USAGE_LIMITS.find((limit) => limit.productId === selectedProductId.value)?.productName ??
    '',
);

const chartPoints = computed(() => TARIFF_MONTHLY_USAGE[selectedProductId.value] ?? []);
</script>

<template>
  <AppCard class="flex flex-col gap-6 p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="text-title-xs font-medium text-(--text-primary)">Использование по месяцам</h2>
        <p class="text-body-sm text-(--text-secondary)">Уникальные пользователи, обработанные моделями</p>
      </div>

      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex h-8 shrink-0 items-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) bg-(--bg-button-secondary) px-3 text-body-sm font-medium text-(--text-primary) transition-colors hover:bg-(--bg-button-secondary-hover)"
          >
            {{ selectedProductName }}
            <ChevronDown class="size-4 text-(--text-primary)" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            :side-offset="4"
            align="end"
            class="w-53 rounded-(--radius-xl) bg-(--surface) p-1 shadow-(--shadow-panel)"
          >
            <DropdownMenuRadioGroup
              :model-value="selectedProductId"
              @update:model-value="selectedProductId = $event"
            >
              <DropdownMenuRadioItem
                v-for="limit in TARIFF_USAGE_LIMITS"
                :key="limit.productId"
                :value="limit.productId"
                class="flex h-8 cursor-pointer items-center justify-between rounded-(--radius-lg) px-3 py-1.5 outline-none hover:bg-(--muted) data-highlighted:bg-(--muted)"
              >
                <span class="text-sm font-medium text-(--text-primary)">{{ limit.productName }}</span>

                <Check
                  v-if="selectedProductId === limit.productId"
                  class="size-4 text-(--text-secondary)"
                />
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>

    <UsageBarChart
      :points="chartPoints"
      :max-value="TARIFF_CHART_MAX_VALUE"
      :series-name="selectedProductName"
    />
  </AppCard>
</template>
