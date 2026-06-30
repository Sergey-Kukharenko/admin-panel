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
      <!-- Контент списка с точными Figma-стилями: padding 4px, gap 2px, размытие и комплексная тень -->
      <DropdownMenuContent
        :align="align ?? 'end'"
        :side-offset="sideOffset ?? 4"
        class="z-50 flex flex-col p-1 gap-[2px] rounded-(--radius-md) bg-white border border-(--border) shadow-[0_0_1px_0_rgba(0,0,0,0.0)_inset,0_2px_8px_0_rgba(0,0,0,0.06),0_-6px_12px_0_rgba(0,0,0,0.03),0_14px_28px_0_rgba(0,0,0,0.08)] backdrop-blur-[20px] focus:outline-none min-w-[160px] animate-in fade-in-50 zoom-in-95 duration-100"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
