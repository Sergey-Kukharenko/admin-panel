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
    <!-- Иллюстрация строго 260x260px согласно макету -->
    <div class="mb-6 flex h-[260px] w-[260px] items-center justify-center overflow-hidden">
      <img
        :src="emptyState"
        alt="empty-state"
        class="h-full w-full object-contain"
        loading="lazy"
      />
    </div>

    <!-- Заголовок строго по типографике макета -->
    <h3 class="mb-1 text-body-md font-medium text-(--foreground)">
      {{ title }}
    </h3>

    <!-- Описание -->
    <p v-if="description" class="mb-6 text-body-sm text-(--muted-foreground) max-w-sm">
      {{ description }}
    </p>

    <!-- Слот под кнопку действия -->
    <div class="flex justify-center">
      <slot name="action" />
    </div>
  </section>
</template>
