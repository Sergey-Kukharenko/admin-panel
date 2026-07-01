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
    class="flex items-center gap-[6px] p-[4px_4px_4px_8px] bg-[var(--card)] select-none box-border border border-[var(--border-default)] rounded-[var(--lg,var(--radius-sm))]"
  >
    <!-- Текст названия источника -->
    <span class="font-sans text-sm font-normal leading-[143%] text-[var(--text-primary)]">
      {{ label }}
    </span>

    <!-- Тег статуса с border-radius: 4px -->
    <div
      :style="tagStyles"
      class="flex h-6 max-h-6 items-center justify-center gap-[4px] px-[6px] py-[4px] rounded-[4px] backdrop-blur-[calc(var(--blur,0px)/2)] box-border"
    >
      <!-- Блок иконки из Lucide -->
      <div class="relative w-[14px] h-[14px] flex items-center justify-center shrink-0">
        <!-- Внешний гексагон -->
        <Hexagon class="w-full h-full text-current" :stroke-width="2.2" />

        <!-- Галочка для активного состояния -->
        <Check
          v-if="isActive"
          class="absolute w-[9px] h-[9px] text-current top-[2.5px]"
          :stroke-width="3"
        />

        <!-- Точка для неактивного состояния -->
        <span v-else class="absolute w-[3px] h-[3px] rounded-full bg-current" />
      </div>

      <!-- Текст статуса -->
      <span class="font-mono text-xs font-medium leading-5 uppercase tracking-wide">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>
