<script setup lang="ts">
import { TARIFF_LIMIT_TOOLTIP, TARIFF_PERIOD_LABEL, TARIFF_USAGE_LIMITS } from '@/entities/tariff';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import { UsageLimitCard } from './usage-limit-card';

defineOptions({
  name: 'TariffLimitsSection',
});
</script>

<template>
  <section class="flex flex-col gap-3 rounded-(--radius-xl) bg-(--bg-surface-neutral) p-2 pt-3">
    <div class="flex items-center justify-between gap-2 px-4">
      <div class="flex items-center gap-1">
        <span class="text-element-tag font-mono font-medium uppercase text-(--text-secondary)">
          лимиты
        </span>

        <AppTooltip :text="TARIFF_LIMIT_TOOLTIP" />
      </div>

      <span class="text-body-sm text-(--text-primary)">{{ TARIFF_PERIOD_LABEL }}</span>
    </div>

    <div class="flex gap-2">
      <UsageLimitCard
        v-for="limit in TARIFF_USAGE_LIMITS"
        :key="limit.productId"
        class="flex-1"
        :title="limit.productName"
        :used-mau="limit.usedMau"
        :limit-mau="limit.limitMau"
      />
    </div>
  </section>
</template>
