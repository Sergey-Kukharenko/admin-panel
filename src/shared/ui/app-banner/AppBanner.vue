<script setup lang="ts">
import { Download } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';

interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <!-- Кликабельна только кнопка действия, сам баннер — статичный блок (WT-519) -->
  <div
    class="flex items-center w-120 h-22 pr-4 gap-3 bg-(--bg-surface-accent) rounded-(--radius-xl) text-left overflow-hidden"
  >
    <div class="shrink-0 h-22 flex items-center justify-center">
      <slot name="icon" />
    </div>

    <div class="flex flex-col w-[320px] gap-1">
      <h4 class="text-sm font-medium text-(--text-primary) leading-5 select-none">
        {{ title }}
      </h4>
      <p
        v-if="description"
        class="text-xs font-normal text-(--text-secondary) leading-4 select-none"
      >
        {{ description }}
      </p>
    </div>

    <div class="shrink-0 ml-auto">
      <AppButton variant="ghost" size="icon" @click="emit('action')">
        <slot name="action-icon">
          <Download stroke-width="2" />
        </slot>
      </AppButton>
    </div>
  </div>
</template>
