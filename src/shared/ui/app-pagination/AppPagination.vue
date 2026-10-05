<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';

import { getPaginationRange } from './model/getPaginationRange';

defineOptions({
  name: 'AppPagination',
});

const { t } = useI18n({ useScope: 'global' });

const currentPage = defineModel<number>('page', { required: true });

const props = defineProps<{
  totalItems: number;
  /** Фиксированный размер страницы — выбора «Строк на стр.» в UI-ките нет */
  pageSize: number;
}>();

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize) || 1);

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
</script>

<template>
  <!-- Компонент Pagination из UI-кита (Figma 52:3936); одна страница — переключать нечего -->
  <nav
    v-if="totalPages > 1"
    class="mt-2 flex items-center justify-end gap-0.5 self-stretch select-none"
  >
    <button
      type="button"
      :disabled="currentPage === 1"
      :aria-label="t('pagination.previousPage')"
      class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-primary) transition-colors hover:bg-(--muted-hover-soft) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none"
      @click="handlePrevPage"
    >
      <AppIcon name="arrow-left-s-line" class="size-4" />
    </button>

    <template v-for="(item, index) in paginationRange" :key="`${item}-${index}`">
      <span
        v-if="item === 'ellipsis'"
        class="flex h-8 min-w-8 items-center justify-center rounded-(--radius-lg) px-3 py-1.5 font-sans text-sm font-medium text-(--text-secondary) select-none"
      >
        …
      </span>

      <button
        v-else
        type="button"
        :aria-current="item === currentPage ? 'page' : undefined"
        class="flex h-8 min-w-8 items-center justify-center rounded-(--radius-lg) px-3 py-1.5 font-sans text-sm font-medium transition-colors cursor-pointer hover:bg-(--muted-hover-soft) focus-visible:outline-none"
        :class="
          item === currentPage
            ? 'bg-(--bg-button-secondary) text-(--text-primary)'
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
      :aria-label="t('pagination.nextPage')"
      class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-primary) transition-colors hover:bg-(--muted-hover-soft) cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-none"
      @click="handleNextPage"
    >
      <AppIcon name="arrow-right-s-line" class="size-4" />
    </button>
  </nav>
</template>
