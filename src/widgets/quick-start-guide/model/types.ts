import type { QUICK_START_STEPS } from '../config/steps';

export type QuickStartStepId = (typeof QUICK_START_STEPS)[number];

export interface QuickStartStep {
  id: QuickStartStepId;
  isDone: boolean;
}

export interface QuickStartProgress {
  steps: QuickStartStep[];
  doneCount: number;
  /** Share of completed steps, 0–100 */
  percent: number;
}
