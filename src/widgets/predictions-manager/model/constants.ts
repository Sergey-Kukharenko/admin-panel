import hasBeenValidatedIcon from '@/widgets/predictions-manager/assets/icons/service-has-been-validated.svg';
import notYetLoadedIcon from '@/widgets/predictions-manager/assets/icons/service-not-yet-loaded.svg';
import serviceReadyIcon from '@/widgets/predictions-manager/assets/icons/service-ready.svg';
import statusAwaitingIcon from '@/widgets/predictions-manager/assets/icons/status-awaiting.svg';
import statusFailedIcon from '@/widgets/predictions-manager/assets/icons/status-failed.svg';
import statusGeneratingIcon from '@/widgets/predictions-manager/assets/icons/status-generating.svg';
import statusReadyIcon from '@/widgets/predictions-manager/assets/icons/status-ready.svg';
import playerIntelligenceIcon from '@/widgets/predictions-manager/assets/player-intelligence.png';
import recommenderSystemIcon from '@/widgets/predictions-manager/assets/recommender-system.png';

import type {
  PredictionIconName,
  PredictionIntegration,
  PredictionStatus,
  PredictionTooltipIconName,
} from './types';

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

export const predictionIntegrations: PredictionIntegration[] = [
  {
    id: 'pi-001',
    category: 'Player Intelligence',
    name: 'Early VIP Identification',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'player-intelligence',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-002',
    category: 'Player Intelligence',
    name: 'Churn Prediction',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'player-intelligence',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-003',
    category: 'Player Intelligence',
    name: 'Non-promising VIP',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'player-intelligence',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-004',
    category: 'Player Intelligence',
    name: 'Growing VIP',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'player-intelligence',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-005',
    category: 'Recommender System',
    name: 'Game Recommendations',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'game-recommendations',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-006',
    category: 'Recommender System',
    name: 'Similar Games',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'game-recommendations',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-007',
    category: 'Recommender System',
    name: 'New Games',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'game-recommendations',
    tooltipIcon: 'service-ready',
  },
  {
    id: 'pi-008',
    category: 'Recommender System',
    name: 'Similar to Selected Game',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'game-recommendations',
    tooltipIcon: 'service-ready',
  },
];
