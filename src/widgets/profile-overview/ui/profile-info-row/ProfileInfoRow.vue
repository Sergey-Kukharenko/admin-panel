<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

defineOptions({
  name: 'ProfileInfoRow',
});

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    labelWidthClass?: string;
    copyable?: boolean;
  }>(),
  {
    labelWidthClass: 'w-49.5',
    copyable: true,
  },
);

async function copyValue() {
  await navigator.clipboard.writeText(props.value);
  toast.success('Скопировано');
}
</script>

<template>
  <div class="flex w-full items-center gap-4">
    <p class="shrink-0 text-sm text-(--text-primary)" :class="labelWidthClass">{{ label }}</p>
    <p class="flex-1 text-sm font-medium text-(--text-primary)">{{ value }}</p>

    <button
      v-if="copyable"
      type="button"
      :aria-label="`Скопировать: ${label}`"
      class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
      @click="copyValue"
    >
      <Copy class="size-4" />
    </button>
    <slot v-else name="action" />
  </div>
</template>
