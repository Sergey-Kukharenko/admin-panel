<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    class="relative flex size-8 shrink-0 items-center justify-center rounded-(--radius-xl) hover:bg-(--bg-button-secondary) focus-visible:bg-(--bg-button-secondary) focus-visible:shadow-(--shadow-focus) focus-visible:outline-none"
  >
    <!-- Icon button of the Top Bar (Figma 52:2712): 32px, radius 12, bg/button/secondary on hover
         and keyboard focus plus the focus ring. The content sits at 70% opacity as one group, as in
         the mockup (a badge over the icon fades together with it). Single root element: as a radix
         trigger (as-child) it gets the attributes, listeners and the anchor ref -->
    <span class="relative flex size-full items-center justify-center opacity-70">
      <slot />
    </span>
  </button>
</template>
