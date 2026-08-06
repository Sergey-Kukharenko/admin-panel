export type PredictionStatus = 'awaiting' | 'generating' | 'ready' | 'failed';

export type PredictionIconName = 'player-intelligence' | 'game-recommendations';

export type PredictionTooltipIconName = 'service-ready' | 'not-yet-loaded' | 'has-been-validated';

export interface PredictionIntegration {
  id: string;
  category: string;
  name: string;
  status: PredictionStatus;
  nextCalculation: string;
  lastCalculation: string;
  tooltipText: string;
  iconName: PredictionIconName;
  tooltipIcon: PredictionTooltipIconName;
}
