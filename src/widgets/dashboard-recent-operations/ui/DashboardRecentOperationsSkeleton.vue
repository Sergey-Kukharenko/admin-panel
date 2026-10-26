<script setup lang="ts">
import DashboardRecentOperationsTable from './DashboardRecentOperationsTable.vue';
</script>

<template>
  <!-- The loading table of the UI kit (HeaderItem state=loading, TableCell type=skeleton, set 52:2468)
       in the frame of the loaded table (388px); no screen frame for the loading state -->
  <div data-operations-skeleton aria-hidden="true">
    <DashboardRecentOperationsTable :rows="[]" loading />
  </div>
</template>
