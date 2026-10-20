import type { ProductModelStatus } from '@/entities/product';
import type { IconName } from '@/shared/ui/app-icon';
import type { AppStatusBadgeStatus } from '@/shared/ui/app-status-badge';

/** Figma Tag type=model next to the product name */
export interface DashboardProductModelTag {
  status: ProductModelStatus;
  label: string;
  icon: IconName;
  /** Text color class of the tag */
  color: string;
  /** White gradient over the text: only Tag status=training has it in the UI kit */
  highlighted: boolean;
}

/** Figma StatusBadge of the Data / Results statuses */
export interface DashboardProductBadge {
  status: AppStatusBadgeStatus;
  label: string;
  /** Icon other than the default one of the badge tone */
  icon?: IconName;
}

/** UI model of one card in the "ML products" block */
export interface DashboardProductCard {
  slug: string;
  name: string;
  /** null for a product without frontend content (descriptions live on the frontend, by slug) */
  description: string | null;
  /** Illustration URL; null for a product without frontend content */
  image: string | null;
  /** false — the product is not connected under the contract: a lock instead of the statuses */
  isAvailable: boolean;
  modelTag: DashboardProductModelTag;
  dataBadge: DashboardProductBadge;
  resultBadge: DashboardProductBadge;
}
