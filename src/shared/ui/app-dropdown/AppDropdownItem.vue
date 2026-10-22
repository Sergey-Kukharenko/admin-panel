<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuRadioItem } from 'radix-vue';
import { computed } from 'vue';

defineOptions({
  name: 'AppDropdownItem',
});

const props = defineProps<{
  /**
   * Renders the slot element itself as the menu item (e.g. an AppButton inside the menu), so it
   * is reachable with the arrow keys; the item styles are not applied
   */
  asChild?: boolean;
  /**
   * `radio` — an option of a DropdownMenuRadioGroup (needs `value`), `checkbox` — a toggled option
   * (needs `checked`); both keep the highlight fill while selected
   */
  type?: 'action' | 'radio' | 'checkbox';
  /** Option value of a `radio` item */
  value?: string;
  /** State of a `checkbox` item */
  checked?: boolean;
}>();

const item = computed(() => {
  switch (props.type) {
    case 'radio':
      return { is: DropdownMenuRadioItem, attrs: { value: props.value ?? '' } };
    case 'checkbox':
      return { is: DropdownMenuCheckboxItem, attrs: { checked: props.checked } };
    case 'action':
    default:
      return { is: DropdownMenuItem, attrs: {} };
  }
});
</script>

<template>
  <DropdownMenuItem v-if="asChild" as-child>
    <slot />
  </DropdownMenuItem>
  <!-- Compact list item from the mockup: 32px high, radius 8 (Figma Dropdown/Default, ListBox). A
       selected radio or checkbox option keeps the bg/surface-secondary fill of the hover state (open
       filters 92:132008, 97:115574): radix marks them with data-state="checked" -->
  <component
    :is="item.is"
    v-else
    v-bind="item.attrs"
    class="flex h-8 max-h-12 px-3 py-1.5 items-center gap-2 self-stretch rounded-(--radius-lg) cursor-pointer select-none outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--bg-surface-secondary) data-[state=checked]:bg-(--bg-surface-secondary)"
  >
    <slot />
  </component>
</template>
