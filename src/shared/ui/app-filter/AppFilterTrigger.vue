<script setup lang="ts">
import { ChevronDown, X } from 'lucide-vue-next';

defineProps<{
  title: string;
  icon: unknown;
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
  <button
    type="button"
    class="flex h-8 min-h-8 max-h-8 items-center justify-center gap-1.5 rounded-sm border border-(--border-subtle) bg-(--surface) pl-3 pr-2 py-1.5 transition-colors hover:bg-(--muted)"
  >
    <component :is="icon" class="size-4 shrink-0 text-(--text-secondary)" />

    <span class="select-none text-sm font-medium leading-5 text-(--text-primary)">
      {{ title }}
    </span>

    <span
      v-if="count"
      class="flex size-4 items-center justify-center rounded-full bg-(--primary) text-body-2xs font-medium text-(--primary-foreground)"
    >
      {{ count }}
    </span>

    <span v-if="clearable" class="flex cursor-pointer items-center justify-center" @click="onClear">
      <X class="size-4 text-(--text-secondary)" />
    </span>

    <ChevronDown v-else class="size-4 text-(--text-primary)" />
  </button>
</template>
