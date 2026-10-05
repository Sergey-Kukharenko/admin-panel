<script setup lang="ts">
import spriteUrl from './assets/sprite.svg?url';
import type { IconName } from './iconNames';

defineOptions({
  name: 'AppIcon',
});

// Иконки дизайн-системы из SVG-спрайта (Figma → Icons, node 52:4927).
// Размер по умолчанию — 16px из атрибутов width/height; любой класс size-*
// его перекрывает (CSS важнее presentation-атрибутов). Цвет — currentColor,
// задаётся через text-*.
defineProps<{
  name: IconName;
}>();
</script>

<template>
  <svg width="16" height="16" class="shrink-0" aria-hidden="true" focusable="false">
    <use :href="`${spriteUrl}#${name}`" />
  </svg>
</template>
