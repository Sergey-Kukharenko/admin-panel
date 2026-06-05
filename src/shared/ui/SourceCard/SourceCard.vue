<script setup lang="ts">
import type { Component } from 'vue';

import AppCard from '@/shared/ui/AppCard';

defineProps<{
  title: string;
  description: string;
  icon: Component;
}>();
</script>

<template>
  <AppCard class="p-6">
    <component :is="icon" class="mb-5 size-8" />

    <h3 class="mb-2 text-xl font-medium">
      {{ title }}
    </h3>

    <p class="mb-5 text-sm text-[var(--muted-foreground)]">
      {{ description }}
    </p>

    <slot />
  </AppCard>
</template>
