<script setup lang="ts">
import { DropdownMenuItem } from 'radix-vue';

defineOptions({
  name: 'AppDropdownItem',
});

defineProps<{
  /**
   * Renders the slot element itself as the menu item (e.g. an AppButton inside the menu), so it
   * is reachable with the arrow keys; the item styles are not applied
   */
  asChild?: boolean;
}>();
</script>

<template>
  <DropdownMenuItem v-if="asChild" as-child>
    <slot />
  </DropdownMenuItem>
  <!-- Compact list item from the mockup: 32px high, radius 8 (Figma Dropdown/Default, ListBox) -->
  <DropdownMenuItem
    v-else
    class="flex h-8 max-h-12 px-3 py-1.5 items-center gap-2 self-stretch rounded-(--radius-lg) cursor-pointer select-none outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--bg-surface-secondary)"
  >
    <slot />
  </DropdownMenuItem>
</template>
