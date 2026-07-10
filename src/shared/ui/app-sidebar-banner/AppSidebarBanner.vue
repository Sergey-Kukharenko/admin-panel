<script setup lang="ts">
import { X } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';

export interface AppSidebarBannerProps {
  title: string;
  description: string;
}

defineProps<AppSidebarBannerProps>();

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'close'): void;
}>();

defineOptions({
  name: 'AppSidebarBanner',
});
</script>

<template>
  <div
    class="relative flex w-53.5 flex-col items-start justify-center gap-4 rounded-xl bg-(--bg-surface-secondary) px-3 pt-4 pb-3 shadow-(--shadow-sidebar-banner)"
  >
    <!-- Кнопка закрытия -->
    <AppButton
      variant="ghost"
      size="icon"
      class="absolute right-2 top-2 z-10"
      aria-label="Закрыть баннер"
      @click.stop="emit('close')"
    >
      <X />
    </AppButton>

    <!-- Кнопка контента -->
    <button
      type="button"
      class="flex w-full flex-col items-start gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) rounded-xl"
      @click="emit('click')"
    >
      <div v-if="$slots.icon" class="size-12 shrink-0">
        <slot name="icon" />
      </div>

      <div class="flex flex-col items-start gap-1 self-stretch">
        <h4 class="text-xs font-medium leading-4 text-(--text-primary)">
          {{ title }}
        </h4>

        <p class="text-xs leading-4 text-(--text-secondary)">
          {{ description }}
        </p>
      </div>
    </button>
  </div>
</template>
