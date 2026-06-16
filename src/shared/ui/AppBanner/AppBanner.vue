<script setup lang="ts">
import { Download } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/AppButton';

interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
defineEmits<{
  (e: 'action'): void;
}>();
</script>

<template>
  <!-- Баннер: фиксированная ширина 480px, высота 88px, отступ справа 16px, gap: 12px -->
  <div
    class="flex items-center w-[480px] h-[88px] pr-4 gap-3 bg-[#F8F8F9] border border-(--border) rounded-(--radius-lg) shadow-sm text-left overflow-hidden transition-all hover:bg-(--color-neutral-100)"
  >
    <!-- Изображение: занимает всю высоту 88px, гибкое сжатие отключено -->
    <div class="flex-shrink-0 h-[88px] flex items-center justify-center">
      <slot name="icon" />
    </div>

    <!-- Контейнер с текстом: фиксированная ширина 320px, gap: 4px -->
    <div class="flex flex-col w-[320px] gap-1">
      <!-- Заголовок: цвет text-primary, font-size: 14px (sm), font-weight: 500, line-height: 20px -->
      <h4 class="text-sm font-medium text-(--text-primary) leading-5 select-none">
        {{ title }}
      </h4>
      <!-- Описание: цвет text-secondary, font-size: 12px (xs), font-weight: 400, line-height: 16px -->
      <p
        v-if="description"
        class="text-xs font-normal text-(--text-secondary) leading-4 select-none"
      >
        {{ description }}
      </p>
    </div>

    <!-- Кнопка действия (скачивание): min/max-height: 32px, padding: 8px (p-2) -->
    <div class="flex-shrink-0 ml-auto">
      <AppButton
        variant="ghost"
        size="small"
        class="!h-8 !w-8 !p-2 flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary)"
        @click="$emit('action')"
      >
        <slot name="action-icon">
          <!-- Стрелка-иконка: строго 16x16px (aspect-ratio: 1/1) -->
          <Download class="size-4 aspect-square" stroke-width="2" />
        </slot>
      </AppButton>
    </div>
  </div>
</template>
