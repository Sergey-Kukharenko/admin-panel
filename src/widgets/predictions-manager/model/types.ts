/**
 * Result badge status. outdated / invalidData / delayed come from the product run status of the
 * scheduled run (last_product_run_status, WT-532; PM decision in WT-555)
 */
export type PredictionStatus =
  | 'awaiting'
  | 'generating'
  | 'ready'
  | 'failed'
  | 'outdated'
  | 'invalidData'
  | 'delayed';

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
  /** true if awaiting is the scheduled run waiting to start (last_product_run_status = awaiting) */
  isAwaitingSchedule: boolean;
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
