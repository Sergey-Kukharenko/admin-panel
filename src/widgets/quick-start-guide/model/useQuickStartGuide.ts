import { computed } from 'vue';

import { useProductStatusSummaries } from '@/entities/product';

import { getQuickStartProgress } from '../lib/progress';

/** Quick start steps and progress of the client from the product statuses */
export function useQuickStartGuide() {
  const { summaries } = useProductStatusSummaries();

  const progress = computed(() => getQuickStartProgress(summaries.value));

  return { progress };
}
