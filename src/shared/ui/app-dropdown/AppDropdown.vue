<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';

defineOptions({
  name: 'AppDropdown',
});

defineProps<{
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  /**
   * Replaces the default content width, padding and gap
   * (default: min width 160, Figma Dropdown/Default padding 4 and gap 4)
   */
  contentClass?: string;
}>();
</script>

<template>
  <!-- modal=false: иначе radix блокирует скролл body и добавляет компенсирующий
       padding-right поверх уже зарезервированного html { scrollbar-gutter: stable },
       из-за чего страница дёргается вправо при каждом открытии дропдауна -->
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align ?? 'end'"
        :side-offset="sideOffset ?? 4"
        :class="[
          'z-50 flex flex-col rounded-(--radius-xl) bg-(--bg-surface-primary) shadow-(--shadow-panel) backdrop-blur-floating-panel focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100',
          contentClass ?? 'min-w-40 gap-1 p-1',
        ]"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
