import type { AppStatusBadgeStatus } from '@/shared/ui/app-status-badge';

import type { PredictionRunStatus } from '../model/types';

interface RunStatusBadge {
  tone: AppStatusBadgeStatus;
  /** i18n key of the tooltip; without it the badge has no tooltip */
  tooltipKey?: string;
}

// Same tones as the result badges of the cards (WT-555): data problems are red like failed,
// waiting and the delay on our side are neutral
export const RUN_STATUS_BADGES: Record<PredictionRunStatus, RunStatusBadge> = {
  ready: { tone: 'success' },
  generating: { tone: 'loading' },
  failed: { tone: 'error', tooltipKey: 'predictions.history.statusTooltip.failed' },
  awaiting: { tone: 'neutral', tooltipKey: 'predictions.history.statusTooltip.awaiting' },
  outdated: { tone: 'error', tooltipKey: 'predictions.history.statusTooltip.outdated' },
  invalidData: { tone: 'error', tooltipKey: 'predictions.history.statusTooltip.invalidData' },
  delayed: { tone: 'neutral', tooltipKey: 'predictions.history.statusTooltip.delayed' },
};
