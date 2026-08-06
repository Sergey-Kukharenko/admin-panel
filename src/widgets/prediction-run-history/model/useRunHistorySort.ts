import { computed, type Ref, ref } from 'vue';

import type { PredictionRunRecord, PredictionRunSortField, PredictionRunSortOrder } from './types';

// ISO-строки дат сортируются лексикографически так же, как хронологически, поэтому
// startedAt/finishedAt не нуждаются в отдельном парсинге для сравнения
function compareRecords(
  first: PredictionRunRecord,
  second: PredictionRunRecord,
  field: PredictionRunSortField,
): number {
  const firstValue = first[field];
  const secondValue = second[field];

  if (firstValue === null && secondValue === null) return 0;
  if (firstValue === null) return 1;
  if (secondValue === null) return -1;

  if (typeof firstValue === 'number' && typeof secondValue === 'number') {
    return firstValue - secondValue;
  }

  return String(firstValue).localeCompare(String(secondValue), 'ru');
}

export function useRunHistorySort(items: Ref<PredictionRunRecord[]>) {
  const sortField = ref<PredictionRunSortField | null>(null);
  const sortOrder = ref<PredictionRunSortOrder>('asc');

  function toggleSort(field: PredictionRunSortField) {
    if (sortField.value !== field) {
      sortField.value = field;
      sortOrder.value = 'asc';
      return;
    }

    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  }

  const sortedItems = computed(() => {
    const field = sortField.value;

    if (!field) return items.value;

    const direction = sortOrder.value === 'asc' ? 1 : -1;

    return [...items.value].sort(
      (first, second) => compareRecords(first, second, field) * direction,
    );
  });

  return { sortField, sortOrder, toggleSort, sortedItems };
}
