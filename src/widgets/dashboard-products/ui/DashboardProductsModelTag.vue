<script setup lang="ts">
import { AppIcon } from '@/shared/ui/app-icon';

import type { DashboardProductModelTag } from '../model/types';

defineProps<{
  tag: DashboardProductModelTag;
}>();
</script>

<template>
  <!-- Figma Tag type=model: 20px, no fill, 14px icon, Geist Mono 12/20 uppercase -->
  <span
    class="inline-flex h-5 shrink-0 items-center gap-1 font-mono text-element-tag font-medium uppercase"
    :class="tag.color"
  >
    <AppIcon :name="tag.icon" class="size-3.5 shrink-0" />
    <span class="relative">
      {{ tag.label }}
      <!-- Figma Tag status=training: a gradient rectangle over the text, same box as the text -->
      <span
        v-if="tag.highlighted"
        class="absolute inset-0 bg-(image:--bg-model-training-highlight)"
        aria-hidden="true"
      />
    </span>
  </span>
</template>
