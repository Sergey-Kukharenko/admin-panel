import type { IconName } from '@/shared/ui/app-icon';

import playerIntelligenceIcon from '../assets/player-intelligence.png';
import recommenderSystemIcon from '../assets/recommender-system.png';
import type {
  PredictionIconName,
  PredictionStatus,
  PredictionTooltipIconName,
} from '../model/types';

export const predictionIntegrationIconByName: Record<PredictionIconName, string> = {
  'player-intelligence': playerIntelligenceIcon,
  'game-recommendations': recommenderSystemIcon,
};

// Иконки из набора дизайн-системы (Figma Icons 52:4927) + цвет, который раньше был
// зашит в локальные svg (в <img> currentColor не работал, см. аудит иконок)
export const predictionTooltipIconByName: Record<
  PredictionTooltipIconName,
  { name: IconName; colorClass: string }
> = {
  'service-ready': { name: 'check-alt', colorClass: 'text-(--text-model-active)' },
  'not-yet-loaded': { name: 'cog', colorClass: 'text-(--text-primary)' },
  'has-been-validated': { name: 'cog-2', colorClass: 'text-(--text-primary)' },
  error: { name: 'small-close-line', colorClass: 'text-(--danger-failed)' },
};

export const predictionStatusIconByStatus: Record<PredictionStatus, IconName> = {
  awaiting: 'progress-2-line',
  generating: 'loader-2-line',
  ready: 'check-line',
  failed: 'small-close-line',
};
