import type { ProductStatusSummary } from '@/entities/product';

import { PRODUCT_CARD_CONTENT } from '../config/products';
import { DATA_STATUS_BADGES, PRODUCT_STATUS_TAGS, RESULT_STATUS_BADGES } from '../config/statuses';
import type { DashboardProductCard } from '../model/types';

interface CardTextHelpers {
  /** Display name of the product by its slug */
  productName: (slug: string) => string;
  /** Translation of an i18n key in the current locale */
  t: (key: string) => string;
}

/** Product / Data / Result statuses of the entity → the dashboard card: texts, tag and badges */
export function mapProductStatusToCard(
  summary: ProductStatusSummary,
  { productName, t }: CardTextHelpers,
): DashboardProductCard {
  const content = PRODUCT_CARD_CONTENT[summary.productSlug];
  const tag = PRODUCT_STATUS_TAGS[summary.productStatus];

  return {
    slug: summary.productSlug,
    name: productName(summary.productSlug),
    description: content ? t(content.descriptionKey) : null,
    image: content?.image ?? null,
    isAvailable: summary.isAvailable,
    modelTag: {
      status: summary.productStatus,
      label: t(`dashboard.products.productStatus.${summary.productStatus}`),
      icon: tag.icon,
      color: tag.color,
      highlighted: tag.highlighted ?? false,
    },
    dataBadge: {
      ...DATA_STATUS_BADGES[summary.dataStatus],
      label: t(`dashboard.products.dataStatus.${summary.dataStatus}`),
    },
    resultBadge: {
      ...RESULT_STATUS_BADGES[summary.resultStatus],
      label: t(`dashboard.products.resultStatus.${summary.resultStatus}`),
    },
  };
}
