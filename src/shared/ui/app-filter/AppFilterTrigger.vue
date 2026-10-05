<script setup lang="ts">
import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineProps<{
  title: string;
  icon: IconName;
  count?: number;
  clearable?: boolean;
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
  <!-- data-state="open" ставит DropdownMenuTrigger (as-child) — по нему переключаем шеврон -->
  <button
    type="button"
    class="group flex h-8 min-h-8 max-h-8 items-center justify-center gap-1.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--surface) pl-3 pr-2 py-1.5 transition-colors hover:bg-(--muted)"
  >
    <AppIcon :name="icon" class="size-4 text-(--text-secondary)" />

    <span class="select-none text-sm font-medium leading-5 text-(--text-primary)">
      {{ title }}
    </span>

    <span
      v-if="count"
      class="flex size-4 items-center justify-center rounded-(--radius-full) bg-(--primary) text-body-2xs font-medium text-(--primary-foreground)"
    >
      {{ count }}
    </span>

    <span v-if="clearable" class="flex cursor-pointer items-center justify-center" @click="onClear">
      <AppIcon name="small-close-line" class="size-4 text-(--text-secondary)" />
    </span>

    <template v-else>
      <AppIcon
        name="large-line-arrow-down"
        class="size-4 text-(--text-primary) group-data-[state=open]:hidden"
      />
      <AppIcon
        name="large-line-arrow-up"
        class="hidden size-4 text-(--text-primary) group-data-[state=open]:block"
      />
    </template>
  </button>
</template>
