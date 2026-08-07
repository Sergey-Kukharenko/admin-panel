import hasBeenValidatedIcon from '@/widgets/predictions-manager/assets/icons/service-has-been-validated.svg';
import notYetLoadedIcon from '@/widgets/predictions-manager/assets/icons/service-not-yet-loaded.svg';
import serviceReadyIcon from '@/widgets/predictions-manager/assets/icons/service-ready.svg';
import statusAwaitingIcon from '@/widgets/predictions-manager/assets/icons/status-awaiting.svg';
import statusFailedIcon from '@/widgets/predictions-manager/assets/icons/status-failed.svg';
import statusGeneratingIcon from '@/widgets/predictions-manager/assets/icons/status-generating.svg';
import statusReadyIcon from '@/widgets/predictions-manager/assets/icons/status-ready.svg';
import playerIntelligenceIcon from '@/widgets/predictions-manager/assets/player-intelligence.png';
import recommenderSystemIcon from '@/widgets/predictions-manager/assets/recommender-system.png';

import type { PredictionIconName, PredictionStatus, PredictionTooltipIconName } from './types';

export const predictionIntegrationIconByName: Record<PredictionIconName, string> = {
  'player-intelligence': playerIntelligenceIcon,
  'game-recommendations': recommenderSystemIcon,
};

export const predictionTooltipIconByName: Record<PredictionTooltipIconName, string> = {
  'service-ready': serviceReadyIcon,
  'not-yet-loaded': notYetLoadedIcon,
  'has-been-validated': hasBeenValidatedIcon,
};

export const predictionStatusIconByStatus: Record<PredictionStatus, string> = {
  awaiting: statusAwaitingIcon,
  generating: statusGeneratingIcon,
  ready: statusReadyIcon,
  failed: statusFailedIcon,
};
