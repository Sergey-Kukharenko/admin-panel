<script setup lang="ts">
import { computed } from 'vue';

import type { AppButtonProps } from './AppButton.types';

defineOptions({
  name: 'AppButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
});

// Colors per variant and state follow the Figma "Button" component set (UI kit 55:1353).
// Pressed = the hover fill in every type: the UI kit binds state=pressed to the hover variables
// (primary 55:1490 → bg/button/primary-hover, secondary 55:1482 → bg/button/secondary-hover), so
// the *-pressed tokens of colors.css are not used.
// Focus = the hover fill plus the focus ring; disabled = the default look at 50% opacity (see template)
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return [
        'bg-(--bg-button-secondary)',
        'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary-hover)',
        'active:bg-(--bg-button-secondary-hover)',
        'focus-visible:bg-(--bg-button-secondary-hover)',
      ];

    case 'outline':
      // The Figma stroke is inside the button and does not add to its size: inset ring, not border.
      // Focus has no stroke, only the focus ring
      if (props.size === 'icon') {
        // Icon-only outline button (modal close): transparent, icon/primary icon, gray fill on hover
        return [
          'ring-1 ring-inset',
          'ring-(--border-default)',
          'bg-transparent',
          'text-(--icon-primary)',
          'hover:bg-(--bg-button-secondary)',
          'active:bg-(--bg-button-secondary)',
          'focus-visible:bg-(--bg-button-secondary)',
          'focus-visible:ring-transparent',
        ];
      }
      // Hover and pressed add the secondary fill; the hover stroke turns to border/focus only for
      // size=sm (UI kit Button 55:1430 md vs 55:1438 sm)
      return [
        'ring-1 ring-inset',
        'ring-(--border-default)',
        'bg-transparent',
        'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary)',
        'active:bg-(--bg-button-secondary)',
        props.size === 'small' && 'hover:ring-(--border-focus)',
        'active:ring-(--border-default)',
        'focus-visible:bg-(--bg-button-secondary)',
        'focus-visible:ring-transparent',
      ];

    case 'ghost':
      // UI kit icon: icon/secondary, icon/primary on hover (55:1398 / 55:1458)
      if (props.size === 'icon') {
        return [
          'bg-transparent',
          'text-(--icon-secondary)',
          'hover:bg-(--bg-button-secondary)',
          'hover:text-(--icon-primary)',
          'active:bg-(--bg-button-secondary)',
          'active:text-(--icon-primary)',
          'focus-visible:bg-(--bg-button-secondary)',
          'focus-visible:text-(--icon-primary)',
        ];
      }
      // UI kit label: text/secondary for size=sm (55:1374), default-foreground for size=md (55:1366)
      return [
        'bg-transparent',
        props.size === 'small' ? 'text-(--text-secondary)' : 'text-(--default-foreground)',
        'hover:bg-(--bg-button-secondary)',
        'hover:text-(--default-foreground)',
        'active:bg-(--bg-button-secondary)',
        'focus-visible:bg-(--bg-button-secondary)',
        'focus-visible:text-(--default-foreground)',
      ];

    case 'primary':
    default:
      return [
        'bg-(--bg-button-primary)',
        'text-(--text-inverse-soft)',
        'hover:bg-(--bg-button-primary-hover)',
        'active:bg-(--bg-button-primary-hover)',
        'focus-visible:bg-(--bg-button-primary-hover)',
      ];
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return ['h-8', 'px-3', 'gap-1.5', 'rounded-(--radius-lg)'];

    case 'icon':
      return ['size-8', 'p-2', 'shrink-0', '[&>svg]:size-4', 'rounded-(--radius-lg)'];

    case 'medium':
    default:
      return ['h-9', 'px-4', 'gap-2', 'rounded-(--radius-lg)'];
  }
});

const typographyClasses = computed(() => {
  return props.size === 'icon' ? [] : ['text-element-button', 'font-medium'];
});
</script>

<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center',
      'whitespace-nowrap',
      'select-none',
      'transition-colors duration-150 ease-in-out',
      'focus-visible:outline-none',
      'focus-visible:shadow-(--shadow-focus)',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      sizeClasses,
      typographyClasses,
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>
