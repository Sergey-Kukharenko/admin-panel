<script setup lang="ts">
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue';
import { computed } from 'vue';

import { PAGE_SIZE_OPTIONS } from '../model';
import { getPaginationRange } from '../model/utils';

defineOptions({
  name: 'DatasetHistoryPagination',
});

const currentPage = defineModel<number>('page', { required: true });
const pageSize = defineModel<number>('perPage', { required: true });

const props = defineProps<{
  totalItems: number;
  renderedCount: number;
}>();

const totalPages = computed(() => Math.ceil(props.totalItems / pageSize.value) || 1);

const rangeStart = computed(() => {
  if (props.renderedCount === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const rangeEnd = computed(() => {
  if (props.renderedCount === 0) return 0;
  return Math.min(currentPage.value * pageSize.value, props.totalItems);
});

const paginationRange = computed(() => getPaginationRange(currentPage.value, totalPages.value));

function handlePrevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function handleNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page: number) {
  currentPage.value = page;
}

function handlePageSizeChange(value: unknown) {
  pageSize.value = Number(value);
}
</script>

<template>
  <div
    class="flex h-12 w-full items-center justify-between rounded-xl bg-(--bg-surface-neutral) px-6 mt-2 self-stretch border border-(--border-subtle) select-none"
  >
    <!-- Левая часть: Количество строк -->
    <div
      class="flex items-center gap-1 text-xs font-mono font-medium text-(--text-secondary) uppercase"
    >
      <span>Показывать:</span>
      <span class="text-(--text-primary)">{{ rangeStart }}-{{ rangeEnd }}</span>
      <span>из</span>
      <span class="text-(--text-primary)">{{ totalItems }}</span>
    </div>

    <!-- Правая часть: Навигация -->
    <div class="flex items-center gap-6">
      <!-- Выбор размера страницы -->
      <div
        class="flex items-center gap-2 font-mono text-xs font-medium text-(--text-secondary) uppercase"
      >
        <span>Строк на стр:</span>

        <SelectRoot
          :model-value="String(pageSize)"
          @update:model-value="handlePageSizeChange"
        >
          <SelectTrigger
            class="flex items-center gap-1.5 rounded-lg bg-(--muted) px-2.5 py-1 outline-hidden hover:bg-(--muted-hover-soft) data-[state=open]:bg-(--muted-hover-soft) cursor-pointer transition-colors"
          >
            <SelectValue class="font-sans text-xs font-medium text-(--text-primary)" />
            <ChevronDown class="size-3 text-(--text-primary)" stroke-width="2.5" />
          </SelectTrigger>

          <SelectPortal>
            <SelectContent
              position="popper"
              :side-offset="4"
              class="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-xl border border-(--border-subtle) bg-(--surface) p-1 shadow-(--shadow-panel) transition-[opacity,transform] duration-150 starting:scale-95 starting:opacity-0"
            >
              <SelectViewport class="flex flex-col gap-0.5">
                <SelectItem
                  v-for="size in PAGE_SIZE_OPTIONS"
                  :key="size"
                  :value="String(size)"
                  class="flex h-8 cursor-pointer items-center justify-center rounded-lg font-sans text-xs font-medium text-(--text-primary) outline-none data-highlighted:bg-(--muted) data-[state=checked]:bg-(--muted)"
                >
                  <SelectItemText>{{ size }}</SelectItemText>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
      </div>

      <!-- Переключатели страниц -->
      <div class="flex items-center gap-0.5">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="flex size-8 items-center justify-center rounded-lg text-(--text-primary) transition-colors hover:bg-(--muted-hover-soft) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none"
          @click="handlePrevPage"
        >
          <ChevronLeft class="size-4" stroke-width="2.5" />
        </button>

        <template v-for="(item, index) in paginationRange" :key="`${item}-${index}`">
          <span
            v-if="item === 'ellipsis'"
            class="flex h-8 min-w-8 items-center justify-center rounded-lg px-3 py-1.5 font-sans text-sm font-medium text-(--text-secondary) select-none"
          >
            …
          </span>

          <button
            v-else
            type="button"
            class="flex h-8 min-w-8 items-center justify-center rounded-lg px-3 py-1.5 font-sans text-sm font-medium normal-case transition-colors cursor-pointer hover:bg-(--muted-hover-soft) focus-visible:outline-none"
            :class="
              item === currentPage
                ? 'bg-(--muted) text-(--text-primary)'
                : 'text-(--text-secondary)'
            "
            @click="goToPage(item)"
          >
            {{ item }}
          </button>
        </template>

        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="flex size-8 items-center justify-center rounded-lg text-(--text-primary) transition-colors hover:bg-(--muted-hover-soft) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none"
          @click="handleNextPage"
        >
          <ChevronRight class="size-4" stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>
