<script setup lang="ts">
import { DropdownMenuItem } from 'radix-vue';

defineOptions({
  name: 'AppDropdownItem',
});
</script>

<template>
  <DropdownMenuItem
    class="flex h-9 max-h-12 px-3 py-1.5 items-center gap-2 self-stretch rounded-sm cursor-pointer select-none outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--muted)"
  >
    <slot />
  </DropdownMenuItem>
</template>
