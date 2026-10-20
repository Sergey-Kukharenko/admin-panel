<script setup lang="ts">
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'radix-vue';

defineOptions({
  name: 'AppScrollArea',
});

defineProps<{
  /** Size limits of the scrollable viewport, e.g. "max-h-73" */
  viewportClass?: string;
}>();
</script>

<template>
  <!-- type="auto": the thumb is visible whenever content overflows, as drawn in the mockup -->
  <ScrollAreaRoot type="auto" class="relative w-full overflow-hidden">
    <ScrollAreaViewport class="w-full" :class="viewportClass">
      <slot />
    </ScrollAreaViewport>

    <!-- Figma _Scrollbar: 10px track with 12px top/bottom and 4px right padding, 6px thumb -->
    <ScrollAreaScrollbar orientation="vertical" class="flex w-2.5 touch-none py-3 pr-1 select-none">
      <ScrollAreaThumb class="flex-1 rounded-(--radius-xl) bg-(--bg-scrollbar-thumb) opacity-48" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>
