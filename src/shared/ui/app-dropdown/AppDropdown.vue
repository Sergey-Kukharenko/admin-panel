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
}>();
</script>

<template>
  <DropdownMenuRoot>
    <!-- Триггер выпадающего списка -->
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <!-- Контент списка  -->
      <DropdownMenuContent
        :align="align ?? 'end'"
        :side-offset="sideOffset ?? 4"
        class="z-50 flex flex-col p-1 gap-0.5 rounded-md bg-(--surface) border border-(--border) shadow-(--shadow-panel) backdrop-blur-floating-panel focus:outline-none min-w-40 animate-in fade-in-50 zoom-in-95 duration-100"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
