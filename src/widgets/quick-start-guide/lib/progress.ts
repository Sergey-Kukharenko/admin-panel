import type {
  ProductDataStatus,
  ProductResultStatus,
  ProductStatusSummary,
} from '@/entities/product';

import { QUICK_START_STEPS } from '../config/steps';
import type { QuickStartProgress, QuickStartStepId } from '../model/types';

// Data counts as uploaded once it has passed validation; later states (an invalid update, outdated
// data) mean it was validated before. Awaiting, processing and issue do not complete the step: the
// frame «Ошибка валидации» shows 0% with ISSUE on the cards
const UPLOADED_DATA_STATUSES: ReadonlySet<ProductDataStatus> = new Set([
  'validated',
  'invalidUpdate',
  'outdated',
]);

// Predictions count as formed once the generation has started, even if it then failed: the frame
// «Ошибка генерации результата» shows 75% (PM decision, 2026-11-03, WT-565)
const STARTED_RESULT_STATUSES: ReadonlySet<ProductResultStatus> = new Set([
  'generating',
  'failed',
  'ready',
]);

const STEP_RULES: Record<QuickStartStepId, (summary: ProductStatusSummary) => boolean> = {
  uploadData: (summary) => UPLOADED_DATA_STATUSES.has(summary.dataStatus),
  setupProduct: (summary) => summary.productStatus === 'active',
  generatePredictions: (summary) => STARTED_RESULT_STATUSES.has(summary.resultStatus),
  resultReady: (summary) => summary.resultStatus === 'ready',
};

function toProgress(isDone: (id: QuickStartStepId) => boolean): QuickStartProgress {
  const steps = QUICK_START_STEPS.map((id) => ({ id, isDone: isDone(id) }));
  const doneCount = steps.filter((step) => step.isDone).length;

  return { steps, doneCount, percent: Math.round((doneCount / steps.length) * 100) };
}

/**
 * Quick start progress from the statuses of the client's products. With several products the guide
 * follows the one that has gone furthest (PM decision, 2026-11-03, WT-565); products not available
 * under the contract do not count.
 */
export function getQuickStartProgress(summaries: ProductStatusSummary[]): QuickStartProgress {
  return summaries
    .filter((summary) => summary.isAvailable)
    .map((summary) => toProgress((id) => STEP_RULES[id](summary)))
    .reduce<QuickStartProgress>(
      (best, progress) => (progress.doneCount > best.doneCount ? progress : best),
      toProgress(() => false),
    );
}
