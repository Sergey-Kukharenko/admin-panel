<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppSkeleton } from '@/shared/ui/app-skeleton';
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import type { RecentOperationRow } from '../model/types';

withDefaults(
  defineProps<{
    rows: RecentOperationRow[];
    /** id of the block title: the accessible name of the table */
    labelledBy?: string;
    /** The loading table of the UI kit: skeleton bars instead of the header texts and the rows */
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { t } = useI18n({ useScope: 'global' });

const COLUMNS = [
  { key: 'date', labelKey: 'dashboard.recentOperations.columns.date' },
  { key: 'type', labelKey: 'dashboard.recentOperations.columns.type' },
  { key: 'details', labelKey: 'dashboard.recentOperations.columns.details' },
  { key: 'status', labelKey: 'dashboard.recentOperations.columns.status' },
] as const;

/** Rows of the loading table: as many as the API returns (H2 mockup 1574:181319) */
const SKELETON_ROWS = 8;

// a cell of a row (UI kit TableCell 52:2468): 44px with the line under it and on its right
const CELL = 'h-11 border-r border-b border-(--border-default) px-4';
const TEXT_CELL = [CELL, 'truncate text-body-sm font-medium text-(--text-primary)'];
</script>

<template>
  <!-- UI kit Table 52:4174 (H2 mockup 1574:181319): three equal columns and a 140px status column;
       header 36px on bg/surface-secondary with elements/tag text and no line under it (the fill alone
       separates it from the first row, as in the mockup), rows 44px with body/sm medium text,
       a 1px border/default line under every body row and on the right of every cell, the last ones too:
       as in the mockup they lie over the table outline. Loading: HeaderItem state=loading (80x10 bars)
       and TableCell type=skeleton (69x12 bars) -->
  <div class="relative overflow-hidden rounded-(--radius-xl)">
    <table
      :aria-labelledby="labelledBy"
      class="w-full table-fixed border-separate border-spacing-0"
    >
      <colgroup>
        <col />
        <col />
        <col />
        <col class="w-35" />
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="column in COLUMNS"
            :key="column.key"
            scope="col"
            class="h-9 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 text-left font-mono text-element-tag font-medium text-(--text-secondary) uppercase"
          >
            <AppSkeleton v-if="loading" class="h-2.5 w-20 rounded-(--radius-sm)" />
            <template v-else>{{ t(column.labelKey) }}</template>
          </th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr v-for="row in SKELETON_ROWS" :key="row">
          <td v-for="column in COLUMNS" :key="column.key" :class="CELL">
            <AppSkeleton class="h-3 w-17.25 rounded-(--radius-sm)" />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="row in rows" :key="row.id" data-operation-row>
          <td :class="TEXT_CELL">
            {{ row.dateLabel }}
          </td>
          <td :class="TEXT_CELL">
            {{ row.typeLabel }}
          </td>
          <!-- the full text on hover where the equal columns cut it (a 1280px window already),
               as the run ID in the prediction run history; no AppTooltip for cut text in the app -->
          <td :class="TEXT_CELL" :title="row.details">
            {{ row.details }}
          </td>
          <td :class="CELL">
            <!-- a block box: an inline badge would sit on the text baseline, ~2px above the centre -->
            <div class="flex">
              <AppStatusBadge :status="row.status" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- the outline of the table is drawn inside, over the cells (strokeAlign INSIDE) -->
    <span
      class="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-(--border-default) ring-inset"
      aria-hidden="true"
    />
  </div>
</template>
