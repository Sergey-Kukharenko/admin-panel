import { describe, expect, it } from 'vitest';

import type { ProductStatusSummary } from '@/entities/product';

import { PRODUCT_CARD_CONTENT } from '../../config/products';
import { mapProductStatusToCard } from '../mapper';

const SUMMARY: ProductStatusSummary = {
  productSlug: 'game-recommender',
  isAvailable: true,
  productStatus: 'training',
  dataStatus: 'processing',
  resultStatus: 'generating',
};

// The keys stand in for the translations: the mapper only has to pick the right ones
const helpers = { productName: (slug: string) => `name:${slug}`, t: (key: string) => key };

describe('mapProductStatusToCard', () => {
  it('takes the name, the description and the illustration by the product slug', () => {
    const card = mapProductStatusToCard(SUMMARY, helpers);

    expect(card).toMatchObject({
      slug: 'game-recommender',
      name: 'name:game-recommender',
      description: 'dashboard.products.descriptions.recommenderSystem',
      image: PRODUCT_CARD_CONTENT['game-recommender']?.image,
      isAvailable: true,
    });
  });

  it('labels the tag and the badges with the keys of their statuses', () => {
    const card = mapProductStatusToCard(SUMMARY, helpers);

    expect(card.modelTag).toMatchObject({
      status: 'training',
      label: 'dashboard.products.productStatus.training',
      highlighted: true,
    });
    expect(card.dataBadge).toMatchObject({
      status: 'loading',
      label: 'dashboard.products.dataStatus.processing',
    });
    expect(card.resultBadge).toEqual({
      status: 'neutral',
      icon: 'loader-2-line',
      label: 'dashboard.products.resultStatus.generating',
    });
  });

  it('a tag without the highlight gets highlighted: false', () => {
    const card = mapProductStatusToCard({ ...SUMMARY, productStatus: 'active' }, helpers);

    expect(card.modelTag.highlighted).toBe(false);
  });

  it('a product without frontend content still gets a card, without description and image', () => {
    const card = mapProductStatusToCard({ ...SUMMARY, productSlug: 'new-product' }, helpers);

    expect(card).toMatchObject({ name: 'name:new-product', description: null, image: null });
  });
});
