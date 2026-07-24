<script setup lang="ts">
import { ChevronDown, FileText, PieChart } from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
  name: 'DatasetHistoryGroupHeader',
});

const props = defineProps<{
  date: string;
  uploadedCount: number;
  totalCount: number;
  source: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

/**
 * 🗓️ Нативное форматирование даты через Intl API браузера
 * Переводит "2026-07-24T09:57:23.585609Z" ➔ "24 июл. 2026 г., 11:57"
 */
const formattedDate = computed(() => {
  if (!props.date) return '';

  const dateObj = new Date(props.date);

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
});
</script>

<template>
  <button
    type="button"
    class="flex gap-3 h-12 w-full items-center bg-transparent px-6 text-left focus-visible:outline-none"
    @click="$emit('toggle')"
  >
    <div class="flex min-w-0 items-center gap-3">
      <div class="flex shrink-0 items-center gap-2">
        <ChevronDown
          :class="[
            'size-4 text-(--text-primary) transition-transform duration-200',
            { '-rotate-90': !expanded },
          ]"
          stroke-width="2.5"
        />
      </div>
      <!-- Выводим готовую красивую дату из computed -->
      <span class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none">
        {{ formattedDate }}
      </span>
    </div>

    <div class="flex gap-1">
      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-full bg-(--muted) pl-1.5 pr-2 py-1 select-none"
        >
          <PieChart class="size-3.5 shrink-0 text-(--text-primary)" stroke-width="2" />
          <span
            class="font-mono text-xs font-medium uppercase text-(--text-primary) leading-5 pl-0.5"
          >
            {{ uploadedCount }}/{{ totalCount }}
          </span>
        </div>
      </div>

      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-full bg-(--muted) pl-1.5 pr-2 py-1 select-none"
        >
          <FileText class="size-3.5 shrink-0 text-(--text-primary)" stroke-width="2" />
          <span
            class="font-mono text-xs font-medium uppercase text-(--text-primary) leading-5 pl-0.5"
          >
            Источник: {{ source }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>
