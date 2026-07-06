<script setup lang="ts">
import emptyState from '@/shared/assets/images/empty-state.svg';

defineOptions({
  name: 'AppEmptyState',
});

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <section
    class="flex flex-col items-center justify-center py-12 px-4 text-center w-full max-w-xl mx-auto"
  >
    <div class="mb-6 flex h-65 w-65 items-center justify-center overflow-hidden">
      <img
        :src="emptyState"
        alt="empty-state"
        class="h-full w-full object-contain"
        loading="lazy"
      />
    </div>

    <!-- Заголовок -->
    <h3 class="mb-1 text-title-sm font-medium text-(--foreground)">
      {{ title }}
    </h3>

    <!-- Описание -->
    <p v-if="description" class="mb-6 max-w-sm text-body-sm text-(--muted-foreground)">
      {{ description }}
    </p>

    <!-- Слот под кнопку действия -->
    <div class="flex justify-center">
      <slot name="action" />
    </div>
  </section>
</template>
