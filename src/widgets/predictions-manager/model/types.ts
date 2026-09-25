export type PredictionStatus = 'awaiting' | 'generating' | 'ready' | 'failed';

export type PredictionIconName = 'player-intelligence' | 'game-recommendations';

/** Состояние подготовки/обучения сервиса — определяет info-иконку и ее тултип (макеты Figma) */
export type PredictionServiceState = 'awaitingData' | 'training' | 'ready' | 'trainingFailed';

export type PredictionTooltipIconName =
  | 'service-ready'
  | 'not-yet-loaded'
  | 'has-been-validated'
  | 'error';

export interface PredictionIntegration {
  id: string;
  category: string;
  name: string;
  status: PredictionStatus;
  /** true, если generating вызван первичным обучением (service_status = TRAINING), а не инференсом */
  isTraining: boolean;
  nextCalculation: string;
  /** null, если у сервиса еще не было ни одного успешного расчета (первое обучение, фаза POC) */
  lastCalculation: string | null;
  /** Состояние подготовки сервиса; текст тултипа — predictions.manager.serviceTooltip.<state> */
  serviceState: PredictionServiceState;
  iconName: PredictionIconName;
  tooltipIcon: PredictionTooltipIconName;
  /** id сервиса, от которого зависит текущий — при его падении в ERROR текущий каскадно тоже переходит в ERROR (WT-291) */
  dependsOnId?: string;
}
