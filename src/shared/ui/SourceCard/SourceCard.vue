<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  title: string;
  description: string;
  icon: Component;
  active?: boolean;
}>();
</script>

<template>
  <div class="rounded-2xl border border-(--color-border) bg-white p-6">
    <div class="mb-5 flex items-start justify-between">
      <component :is="icon" class="size-8 text-[#7FA85B]" />

      <span class="text-sm text-[#6C6C6C]">
        {{ active ? 'Активен' : 'Неактивен' }}
      </span>
    </div>

    <h3 class="mb-2 text-[28px] font-medium">
      {{ title }}
    </h3>

    <p class="mb-5 text-sm leading-6 text-(--color-text-secondary)">
      {{ description }}
    </p>

    <slot />
  </div>
</template>
