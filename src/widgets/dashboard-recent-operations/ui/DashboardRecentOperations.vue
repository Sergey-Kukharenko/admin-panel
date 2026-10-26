<script setup lang="ts">
import { useId } from 'vue';
import { useI18n } from 'vue-i18n';

import { useDashboardRecentOperations } from '../model/useDashboardRecentOperations';
import DashboardRecentOperationsEmptyState from './DashboardRecentOperationsEmptyState.vue';
import DashboardRecentOperationsErrorState from './DashboardRecentOperationsErrorState.vue';
import DashboardRecentOperationsSkeleton from './DashboardRecentOperationsSkeleton.vue';
import DashboardRecentOperationsTable from './DashboardRecentOperationsTable.vue';

const { view, hasData, countLabel, isLoading, isError, refetch } = useDashboardRecentOperations();

// the title names the table for screen readers
const titleId = useId();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Figma block «Последние операции» (H2 mockup 1574:181319, header 92:54237): 16px on top, title
       and counter 16px over the table. Not in the MVP dashboard frames: hidden behind
       FEATURE_RECENT_OPERATIONS on the page (WT-327). The title is text/primary: in the frame every other
       text but the «Active» tags is bound to a variable, this one has a raw color (asked in WT-327) -->
  <section class="flex flex-col gap-4 pt-4">
    <div class="flex h-6 items-center justify-between pr-4">
      <h2 :id="titleId" class="text-title-sm font-medium text-(--text-primary)">
        {{ t('dashboard.recentOperations.title') }}
      </h2>
      <p v-if="hasData" class="text-body-sm font-medium text-(--text-primary)">
        {{ countLabel }}
      </p>
    </div>

    <DashboardRecentOperationsSkeleton v-if="isLoading" />
    <DashboardRecentOperationsErrorState v-else-if="isError" @retry="refetch()" />
    <DashboardRecentOperationsTable
      v-else-if="hasData && view"
      :rows="view.rows"
      :labelled-by="titleId"
    />
    <DashboardRecentOperationsEmptyState v-else />
  </section>
</template>
