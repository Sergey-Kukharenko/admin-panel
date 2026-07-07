<script setup lang="ts">
import { Check, Hexagon } from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
  label: string;
  statusText: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
});

// Динамические стили для тега на основе семантических переменных
const tagStyles = computed(() => {
  return props.isActive
    ? {
        backgroundColor: 'var(--bg-tag-active)',
        color: 'var(--color-green-700)',
      }
    : {
        backgroundColor: 'var(--bg-tag-inactive)',
        color: 'var(--text-primary)',
      };
});
</script>

<template>
  <div
    class="flex items-center gap-1.5 p-[4px_4px_4px_8px] bg-(--card) select-none box-border border border-(--border-default) rounded-(--lg,var(--radius-sm))"
  >
    <!-- Текст названия источника -->
    <span class="font-sans text-sm font-normal leading-[143%] text-(--text-primary)">
      {{ label }}
    </span>

    <!-- Тег статуса -->
    <div
      :style="tagStyles"
      class="flex h-6 max-h-6 items-center justify-center gap-1 px-1.5 py-1 rounded-sm backdrop-blur-[calc(var(--blur,0px)/2)] box-border"
    >
      <div class="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
        <Hexagon class="w-full h-full text-current" :stroke-width="2.2" />

        <!-- Галочка для активного состояния -->
        <Check
          v-if="isActive"
          class="absolute w-2.25 h-2.25 text-current top-[2.5px]"
          :stroke-width="3"
        />

        <!-- Точка для неактивного состояния -->
        <span v-else class="absolute w-0.75 h-0.75 rounded-full bg-current" />
      </div>

      <!-- Текст статуса -->
      <span class="font-mono text-xs font-medium leading-5 uppercase tracking-wide">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>
