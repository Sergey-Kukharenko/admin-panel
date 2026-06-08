<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  actionIcon?: string; // Название иконки для действия (например, скачивание)
}

defineProps<Props>();
defineEmits(['action']);
</script>

<template>
  <div
    class="flex items-center justify-between p-4 bg-(--color-neutral-75) border border-(--border) rounded-(--radius-lg) shadow-sm w-full max-w-2xl transition-all hover:bg-(--color-neutral-100)"
  >
    <div class="flex items-center gap-4">
      <!-- Иллюстрация / Иконка баннера -->
      <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-(--color-neutral-0) border border-(--border)">
        <slot name="icon">
          <!-- Дефолтная заглушка или кастомная иконка -->
          <span class="text-xl">📁</span>
        </slot>
      </div>

      <!-- Текстовый блок -->
      <div class="flex flex-col gap-0.5">
        <h4 class="text-body-md font-medium text-(--foreground)">
          {{ title }}
        </h4>
        <p v-if="description" class="text-body-sm text-(--muted-foreground)">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Кнопка действия (используем наш AppButton) -->
    <div class="flex-shrink-0">
      <AppButton
        variant="ghost"
        size="small"
        class="text-(--color-neutral-600) hover:text-(--foreground)"
        @click="$emit('action')"
      >
        <slot name="action-icon">
          <!-- Дефолтная иконка скачивания из макета -->
          <svg xmlns="http://w3.org" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </slot>
      </AppButton>
    </div>
  </div>
</template>
