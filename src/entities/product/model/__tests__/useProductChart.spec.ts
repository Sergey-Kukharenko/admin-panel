import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { listDays } from '@/shared/lib/chart';

import { useProductChart } from '../useProductChart';

describe('useProductChart (mock until WT-322)', () => {
  it.each(['game-recommender', 'player-intelligence'])(
    '%s: the RFC shape — no filters, a dense point for every day, the total is the sum (RFC 4.3–4.4)',
    (slug) => {
      const chart = useProductChart(slug).data.value;
      const days = chart ? listDays(chart.period.start_date, chart.period.end_date) : [];
      const values = chart?.series.flatMap((series) => series.points.map((point) => point.value));

      expect(chart?.chart_name).toBe(slug);
      expect(chart?.filters).toBeNull();
      expect(chart?.series.length).toBeGreaterThan(0);
      for (const series of chart?.series ?? []) {
        expect(series.points.map((point) => point.date)).toEqual(days);
      }
      expect(chart?.summary.total_value).toBe(values?.reduce((sum, value) => sum + value, 0));
      expect(chart?.has_data).toBe((chart?.summary.total_value ?? 0) > 0);
    },
  );

  it('a product not connected to the project has no chart (the API answers 404)', () => {
    const slug = ref('unknown-product');
    const { data } = useProductChart(slug);

    expect(data.value).toBeNull();

    slug.value = 'player-intelligence';
    expect(data.value?.chart_name).toBe('player-intelligence');
  });

  it('has the shape of useQuery: a synchronous mock is never loading or failing', () => {
    const { isLoading, isError, refetch } = useProductChart('game-recommender');

    expect([isLoading.value, isError.value]).toEqual([false, false]);
    expect(refetch()).toBeInstanceOf(Promise);
  });
});
