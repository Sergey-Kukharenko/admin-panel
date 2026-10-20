import type {
  ProductDataStatus,
  ProductModelStatus,
  ProductResultStatus,
} from '@/entities/product';
import type { IconName } from '@/shared/ui/app-icon';
import type { AppStatusBadgeStatus } from '@/shared/ui/app-status-badge';

interface ModelTagView {
  icon: IconName;
  color: string;
  /** White gradient over the text: only Tag status=training has it in the UI kit */
  highlighted?: boolean;
}

/** Figma Tag type=model: icon and color per product status */
export const PRODUCT_STATUS_TAGS: Record<ProductModelStatus, ModelTagView> = {
  awaiting: { icon: 'cog', color: 'text-(--text-secondary)' },
  training: { icon: 'cog-2', color: 'text-(--text-primary)', highlighted: true },
  active: { icon: 'check-alt', color: 'text-(--text-model-active)' },
  error: { icon: 'cog', color: 'text-(--text-error)' },
};

interface StatusBadgeView {
  status: AppStatusBadgeStatus;
  /** Icon other than the default one of the badge tone */
  icon?: IconName;
}

/** Figma StatusBadge tone per data status (dashboard frames 1322:109368, 1325:164451, 1325:173330…) */
export const DATA_STATUS_BADGES: Record<ProductDataStatus, StatusBadgeView> = {
  awaiting: { status: 'neutral' },
  processing: { status: 'loading' },
  validated: { status: 'success' },
  issue: { status: 'error' },
  invalidUpdate: { status: 'error' },
  outdated: { status: 'error' },
};

/** Figma StatusBadge tone per results status (frames 92:54613, 1322:140344, 1325:171617, 1322:142053) */
export const RESULT_STATUS_BADGES: Record<ProductResultStatus, StatusBadgeView> = {
  awaiting: { status: 'neutral' },
  generating: { status: 'neutral', icon: 'loader-2-line' },
  failed: { status: 'error' },
  ready: { status: 'success' },
};
