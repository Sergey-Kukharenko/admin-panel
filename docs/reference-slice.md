# Эталонный вертикальный срез

Фича «История счетов» (`Invoice` — иллюстративная сущность): entity → feature → widget → page.
Новую функциональность делаем **так же** по структуре и стилю. Правила — в [`CLAUDE.md`](../CLAUDE.md).

Живые эталоны в коде: `widgets/prediction-run-history` (URL-фильтры, маппер с тестами, состояния
экрана), `entities/product` (query-composable с `select` и поллингом), `features/request-integration-connection`
(модалка-действие на `AppModal` + мутация), `shared/ui/app-button`, `shared/ui/app-pagination`.

## entities/invoice

**`api/types.ts`**
```ts
import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

/** GET /invoices */
export type InvoiceListItem = Schemas['InvoiceListItemSchema'];
export type InvoiceListResponse = Schemas['InvoiceListResponseSchema'];
export type InvoiceStatus = InvoiceListItem['status'];
export type InvoiceFilters = NonNullable<operations['list_invoices']['parameters']['query']>;
```

**`api/invoice-api.ts`**
```ts
import { apiClient } from '@/shared/api';

import type { InvoiceFilters, InvoiceListResponse } from './types';

export const invoiceApi = {
  /** List invoices of the current project */
  getInvoices(params?: InvoiceFilters, signal?: AbortSignal) {
    return apiClient.get<InvoiceListResponse>('/invoices', { params, signal });
  },

  /** Download the invoice PDF */
  downloadInvoice(invoiceId: string) {
    return apiClient.get<Blob>(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
  },
};
```

**`model/queryKeys.ts`** — ключ экспортируется, потому что его инвалидирует фича (оплата счёта).
Пока у сущности один запрос и нет мутаций, достаточно константы `['invoices'] as const` рядом с composable.
```ts
import type { InvoiceFilters } from '../api/types';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (filters: InvoiceFilters) => [...invoiceKeys.all, 'list', filters] as const,
};
```

**`index.ts`**
```ts
export { invoiceApi } from './api/invoice-api';
export type * from './api/types';
export { invoiceKeys } from './model/queryKeys';
```

## features/download-invoice

**`model/useDownloadInvoice.ts`**
```ts
import { useMutation } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { invoiceApi } from '@/entities/invoice';
import { downloadBlob } from '@/shared/lib/downloadBlob';
import { getContentDispositionFilename } from '@/shared/lib/getContentDispositionFilename';

export function useDownloadInvoice() {
  const { t } = useI18n({ useScope: 'global' });

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await invoiceApi.downloadInvoice(invoiceId);
      const filename =
        getContentDispositionFilename(response.headers['content-disposition']) ??
        `invoice_${invoiceId}.pdf`;
      downloadBlob(response.data, filename);
    },
    onError: () => toast.error(t('billing.invoices.downloadFailed')),
  });
}
```

**`ui/DownloadInvoiceButton.vue`**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

import { useDownloadInvoice } from '../model/useDownloadInvoice';

const props = defineProps<{
  invoiceId: string;
}>();

const { t } = useI18n({ useScope: 'global' });
const { mutate: download, isPending } = useDownloadInvoice();
</script>

<template>
  <AppButton
    variant="ghost"
    size="icon"
    :disabled="isPending"
    :aria-label="t('billing.invoices.download')"
    @click="download(props.invoiceId)"
  >
    <AppIcon
      :name="isPending ? 'loader-2-line' : 'download-line'"
      :class="{ 'animate-spin': isPending }"
    />
  </AppButton>
</template>
```

**`index.ts`**
```ts
export { default as DownloadInvoiceButton } from './ui/DownloadInvoiceButton.vue';
```

## widgets/invoice-history

**`model/types.ts`**
```ts
import type { InvoiceStatus } from '@/entities/invoice';

export interface InvoiceRecord {
  id: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  /** null until the invoice is paid */
  paidAt: string | null;
}
```

**`lib/mapper.ts`** — необязательные поля DTO нормализуем здесь (`?? null`)
```ts
import type { InvoiceListItem } from '@/entities/invoice';

import type { InvoiceRecord } from '../model/types';

export function mapInvoiceToRecord(item: InvoiceListItem): InvoiceRecord {
  return {
    id: item.invoice_id,
    amount: item.amount,
    status: item.status,
    issuedAt: item.issued_at,
    paidAt: item.paid_at ?? null,
  };
}
```

**`config/urlParams.ts`**
```ts
/** URL query parameter names (filters, pagination) — not TanStack Query keys */
export const URL_PARAMS = {
  page: 'page',
} as const;
```

**`model/useInvoiceHistory.ts`**
```ts
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { invoiceApi, invoiceKeys } from '@/entities/invoice';
import { createQueryPatch } from '@/shared/lib/router';

import { URL_PARAMS } from '../config/urlParams';
import { mapInvoiceToRecord } from '../lib/mapper';

export const INVOICE_HISTORY_PAGE_SIZE = 20;

export function useInvoiceHistory() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  const page = computed<number>({
    get() {
      const value = Number(route.query[URL_PARAMS.page]);
      return Number.isInteger(value) && value > 0 ? value : 1;
    },
    set: (value) => replaceQuery({ [URL_PARAMS.page]: value > 1 ? String(value) : undefined }),
  });

  const filters = computed(() => ({
    limit: INVOICE_HISTORY_PAGE_SIZE,
    offset: (page.value - 1) * INVOICE_HISTORY_PAGE_SIZE,
  }));

  const {
    data: response,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useQuery({
    queryKey: computed(() => invoiceKeys.list(filters.value)),
    queryFn: async ({ signal }) => {
      const result = await invoiceApi.getInvoices(filters.value, signal);
      return result.data;
    },
    placeholderData: keepPreviousData,
  });

  // Error state only when there is no data at all: a failed refetch keeps the table visible
  const isError = computed(() => isRequestError.value && !response.value);

  const records = computed(() => (response.value?.items ?? []).map(mapInvoiceToRecord));
  const totalCount = computed(() => response.value?.total_count ?? 0);
  const hasData = computed(() => records.value.length > 0 || page.value > 1);

  return { records, totalCount, page, hasData, isLoading, isError, refetch };
}
```

**`ui/InvoiceHistoryTable.vue`** (фрагмент: фича в строке таблицы)
```vue
<script setup lang="ts">
import { DownloadInvoiceButton } from '@/features/download-invoice';

import type { InvoiceRecord } from '../model/types';

defineProps<{
  items: InvoiceRecord[];
}>();
</script>

<template>
  <ul class="flex flex-col gap-1">
    <li v-for="item in items" :key="item.id" class="flex items-center gap-4">
      <!-- ...invoice columns... -->
      <DownloadInvoiceButton :invoice-id="item.id" />
    </li>
  </ul>
</template>
```

**`ui/InvoiceHistory.vue`**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppPagination } from '@/shared/ui/app-pagination';

import { INVOICE_HISTORY_PAGE_SIZE, useInvoiceHistory } from '../model/useInvoiceHistory';
import InvoiceHistoryEmptyState from './InvoiceHistoryEmptyState.vue';
import InvoiceHistoryErrorState from './InvoiceHistoryErrorState.vue';
import InvoiceHistorySkeleton from './InvoiceHistorySkeleton.vue';
import InvoiceHistoryTable from './InvoiceHistoryTable.vue';

const { records, totalCount, page, hasData, isLoading, isError, refetch } = useInvoiceHistory();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <section class="flex w-full flex-col gap-4">
    <h2 class="text-title-sm font-medium text-(--text-primary)">
      {{ t('billing.invoices.title') }}
    </h2>

    <InvoiceHistorySkeleton v-if="isLoading" />
    <InvoiceHistoryErrorState v-else-if="isError" @retry="refetch()" />
    <template v-else-if="hasData">
      <InvoiceHistoryTable :items="records" />

      <AppPagination
        v-model:page="page"
        :total-items="totalCount"
        :page-size="INVOICE_HISTORY_PAGE_SIZE"
      />
    </template>
    <InvoiceHistoryEmptyState v-else />
  </section>
</template>
```

**`index.ts`**
```ts
export { default as InvoiceHistory } from './ui/InvoiceHistory.vue';
```

**`lib/__tests__/mapper.spec.ts`**
```ts
import { describe, expect, it } from 'vitest';

import { mapInvoiceToRecord } from '../mapper';

describe('mapInvoiceToRecord', () => {
  it('maps the DTO to the UI model', () => {
    expect(
      mapInvoiceToRecord({
        invoice_id: 'inv-1',
        amount: 100,
        status: 'paid',
        issued_at: '2026-10-01T00:00:00Z',
        paid_at: '2026-10-02T00:00:00Z',
      }),
    ).toEqual({
      id: 'inv-1',
      amount: 100,
      status: 'paid',
      issuedAt: '2026-10-01T00:00:00Z',
      paidAt: '2026-10-02T00:00:00Z',
    });
  });

  it('normalizes a missing paid_at to null', () => {
    expect(
      mapInvoiceToRecord({
        invoice_id: 'inv-2',
        amount: 50,
        status: 'issued',
        issued_at: '2026-10-01T00:00:00Z',
      }).paidAt,
    ).toBeNull();
  });
});
```

## pages/billing

**`ui/BillingPage.vue`** и **`index.ts`**
```vue
<script setup lang="ts">
import { InvoiceHistory } from '@/widgets/invoice-history';
</script>

<template>
  <div class="flex w-full flex-col gap-10">
    <InvoiceHistory />
  </div>
</template>
```
```ts
export { default as BillingPage } from './ui/BillingPage.vue';
```

## app/router/index.ts (фрагмент)

```ts
{
  path: '/billing',
  name: ROUTE_NAMES.billing,
  component: () => import('@/pages/billing').then((m) => m.BillingPage),
  meta: { requiresAuth: true, titleKey: 'layout.nav.billing', nav: { icon: 'receipt-line' } },
},
```

**`shared/i18n/locales/ru.ts` / `en.ts`** — ключи `billing.invoices.*` в оба файла.
