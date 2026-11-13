import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useProductStatusSummaries } from '@/entities/product';
import { useUserStore } from '@/entities/user';

import { getQuickStartProgress } from '../lib/progress';

/** Quick start steps and progress of the client from the product statuses */
export function useQuickStartGuide() {
  const { summaries } = useProductStatusSummaries();
  const { isOnboardingComplete } = storeToRefs(useUserStore());

  const progress = computed(() => getQuickStartProgress(summaries.value));

  // The guide goes away for good once the first result is received; later status changes are
  // operational and do not bring it back (PM decision, 2026-11-03, WT-566)
  const isVisible = computed(() => !isOnboardingComplete.value);

  return { progress, isVisible };
}
