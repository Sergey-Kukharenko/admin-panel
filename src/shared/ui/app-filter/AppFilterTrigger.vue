<script setup lang="ts">
import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineProps<{
  title: string;
  icon?: IconName;
  count?: number;
  clearable?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  clear: [];
}>();

function onClear(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
  emit('clear');
}
</script>

<template>
  <!-- UI kit Filter (02. Master-components 55:793): 32px, radius 8, inside 1px border, no fill;
       hover / pressed / open — bg/button/secondary. data-state="open" comes from DropdownMenuTrigger
       (as-child): it switches the fill and the chevron -->
  <button
    type="button"
    :disabled="disabled"
    class="group flex h-8 shrink-0 items-center gap-1.5 rounded-(--radius-lg) py-1.5 pr-2 pl-3 text-element-button font-medium text-(--default-foreground) ring-1 ring-(--border-default) transition-colors ring-inset hover:bg-(--bg-button-secondary) focus-visible:shadow-(--shadow-focus) focus-visible:outline-none active:bg-(--bg-button-secondary) disabled:pointer-events-none disabled:text-(--text-tertiary) data-[state=open]:bg-(--bg-button-secondary)"
  >
    <AppIcon
      v-if="icon"
      :name="icon"
      class="size-4 text-(--icon-secondary) group-disabled:text-(--icon-tertiary)"
    />

    <span class="select-none">
      {{ title }}
    </span>

    <!-- UI kit Filter type=multiple state=open (55:830): 14px badge, bg/button/primary, text/on-dark
         Geist SemiBold 10/14 -->
    <span
      v-if="count"
      class="flex size-3.5 items-center justify-center rounded-(--radius-full) bg-(--bg-button-primary) text-body-2xs leading-3.5 font-semibold text-(--text-on-dark)"
    >
      {{ count }}
    </span>

    <span v-if="clearable" class="flex cursor-pointer items-center justify-center" @click="onClear">
      <AppIcon name="small-close-line" class="size-4 text-(--icon-primary)" />
    </span>

    <template v-else>
      <AppIcon
        name="large-line-arrow-down"
        class="size-4 text-(--icon-primary) group-disabled:text-(--icon-tertiary) group-data-[state=open]:hidden"
      />
      <AppIcon
        name="large-line-arrow-up"
        class="hidden size-4 text-(--icon-primary) group-data-[state=open]:block"
      />
    </template>
  </button>
</template>
