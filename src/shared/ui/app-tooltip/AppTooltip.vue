<script setup lang="ts">
import { Info } from 'lucide-vue-next';
import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from 'radix-vue';

defineOptions({
  name: 'AppTooltip',
});

withDefaults(
  defineProps<{
    text: string;
    icon?: boolean;
  }>(),
  {
    icon: true,
  },
);
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child>
      <button
        v-if="icon"
        type="button"
        aria-label="Подсказка"
        class="flex size-4 shrink-0 items-center justify-center text-(--text-secondary) focus:outline-none"
      >
        <Info class="size-4" />
      </button>

      <span v-else class="inline-flex items-center gap-1 cursor-help">
        <slot />
      </span>
    </TooltipTrigger>

    <TooltipContent
      side="top"
      :side-offset="6"
      class="z-50 w-57 animate-in fade-in-0 zoom-in-95 duration-100 select-none"
    >
      <div class="rounded-(--radius-sm) bg-(--bg-foreground-overlay) px-2 py-1 backdrop-blur-[20px]">
        <p class="text-xs leading-4 whitespace-pre-line text-(--text-overlay)">{{ text }}</p>
      </div>

      <TooltipArrow class="fill-(--bg-foreground-overlay)" :width="8" :height="4" />
    </TooltipContent>
  </TooltipRoot>
</template>
