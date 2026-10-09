<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import type { IntegrationStatus } from '../../model/types';

defineOptions({
  name: 'ConnectionStatusTag',
});

defineProps<{
  status: IntegrationStatus;
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div v-if="status === 'not_configured'" class="flex shrink-0 items-center gap-1">
    <AppIcon name="cog" class="size-3.5 shrink-0 text-(--text-secondary)" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-(--text-secondary)">
      {{ t('integrations.status.notConfigured') }}
    </span>
  </div>

  <AppTooltip
    v-else-if="status === 'pending'"
    :icon="false"
    :text="t('integrations.status.pendingTooltip')"
  >
    <AppIcon name="cog" class="size-3.5 shrink-0 text-(--icon-warning)" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-(--text-warning)">
      {{ t('integrations.status.pending') }}
    </span>
  </AppTooltip>

  <div v-else class="flex shrink-0 items-center gap-1">
    <AppIcon name="check-alt" class="size-3.5 shrink-0 text-[#668948]" />
    <span class="font-mono text-xs font-medium whitespace-nowrap uppercase text-[#668948]">{{
      t('integrations.status.connected')
    }}</span>
  </div>
</template>
