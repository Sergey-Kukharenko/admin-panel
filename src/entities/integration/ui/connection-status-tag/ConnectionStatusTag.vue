<script setup lang="ts">
import { Check, Settings } from 'lucide-vue-next';

import { AppTooltip } from '@/shared/ui/app-tooltip';

import type { IntegrationStatus } from '../../model/types';

defineOptions({
  name: 'ConnectionStatusTag',
});

defineProps<{
  status: IntegrationStatus;
}>();

const PENDING_TOOLTIP_TEXT =
  'Заявка принята. Наша команда уже приступила к настройке интеграции. Обычно это занимает не более 1 дня.\nКак только всё будет готово, мы пришлем вам уведомление на почту.';
</script>

<template>
  <div v-if="status === 'not_configured'" class="flex shrink-0 items-center gap-1">
    <Settings class="size-3.5 shrink-0 text-(--text-secondary)" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-(--text-secondary)">
      Не настроено
    </span>
  </div>

  <AppTooltip v-else-if="status === 'pending'" :icon="false" :text="PENDING_TOOLTIP_TEXT">
    <Settings class="size-3.5 shrink-0 text-(--icon-warning)" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-(--text-warning)">
      Настройка
    </span>
  </AppTooltip>

  <div v-else class="flex shrink-0 items-center gap-1">
    <Check class="size-3.5 shrink-0 text-[#668948]" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-[#668948]">Подключено</span>
  </div>
</template>
