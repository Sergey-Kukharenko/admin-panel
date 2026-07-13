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
    name: 'Early VIP Detection',
    status: 'awaiting',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText:
      'Мы ожидаем полный набор данных для запуска продукта. После загрузки начнется его подготовка.',
    iconName: 'player-intelligence',
    tooltipIcon: 'not-yet-loaded',
  },
  {
    id: 'pi-002',
    category: 'Player Intelligence',
    name: 'VIP No-Growth Prediction',
    status: 'generating',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Модель производит расчет и генерацию новых прогнозов на основе свежих логов.',
    iconName: 'player-intelligence',
    tooltipIcon: 'has-been-validated',
  },
  {
    id: 'pi-003',
    category: 'Game Recommendations',
    name: 'Next Best Game Predictor',
    status: 'ready',
    nextCalculation: '26 июл, 2026',
    lastCalculation: '19 ИЮЛ, 2026',
    tooltipText: 'Расчет успешно завершен. Рекомендации по играм сформированы.',
    iconName: 'game-recommendations',
    tooltipIcon: 'service-ready',
  },
];
