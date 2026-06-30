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
</script>

<template>
  <ScrollAreaRoot class="h-full w-full overflow-hidden">
    <ScrollAreaViewport class="h-full w-full">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar orientation="vertical" class="flex w-2.5 touch-none select-none p-0.5">
      <ScrollAreaThumb class="flex-1 rounded-full bg-(--color-neutral-300)" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>
