<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { computed, ref } from 'vue';

import { HISTORY_GROUPS_MOCK, useDatasetHistoryFilters } from '../model';
import DatasetHistoryGroupContent from './DatasetHistoryGroupContent.vue';
import DatasetHistoryGroupHeader from './DatasetHistoryGroupHeader.vue';
import DatasetHistoryTableHeader from './DatasetHistoryTableHeader.vue';
import DatasetHistoryToolbar from './DatasetHistoryToolbar.vue';

dayjs.extend(customParseFormat);

defineOptions({
  name: 'DatasetHistoryTable',
});

defineEmits<{
  openUploadDrawer: [];
}>();

const { types, status, period, sortBy, sortOrder, setSort } = useDatasetHistoryFilters();

const expandedGroups = ref(['group-1']);

const historyGroupsMock = ref(HISTORY_GROUPS_MOCK);

function checkPeriod(date: string, periodValue: string) {
  const created = dayjs(date, 'DD MMM YYYY, HH:mm');
  const now = dayjs();

  switch (periodValue) {
    case 'today':
      return created.isSame(now, 'day');
    case 'week':
      return created.isAfter(now.subtract(7, 'day'));
    case 'month':
      return created.isAfter(now.subtract(1, 'month'));
    default:
      return true;
  }
}

const filteredGroups = computed(() => {
  return historyGroupsMock.value.filter((group) => {
    if (period.value && !checkPeriod(group.date, period.value)) {
      return false;
    }
    return true;
  });
});

function toggleGroup(id: string) {
  if (expandedGroups.value.includes(id)) {
    expandedGroups.value = expandedGroups.value.filter((g) => g !== id);
  } else {
    expandedGroups.value.push(id);
  }
}

function handleSortRows() {
  if (sortBy.value !== 'rows') {
    setSort('rows', 'asc');
    return;
  }

  setSort('rows', sortOrder.value === 'asc' ? 'desc' : 'asc');
}
</script>

<template>
  <div class="mx-auto flex flex-col items-start gap-4 self-stretch">
    <DatasetHistoryToolbar
      v-model:types="types"
      v-model:status="status"
      v-model:period="period"
      @open-upload="$emit('openUploadDrawer')"
    />

    <div class="flex w-full flex-col gap-1 self-stretch">
      <DatasetHistoryTableHeader
        :sort-by="sortBy"
        :sort-order="sortOrder"
        @sort-rows="handleSortRows"
      />

      <!-- Заменили bg-[rgba(48,48,50,0.03)] на общую переменную bg-(--bg-surface-neutral) -->
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="flex w-full flex-col items-center overflow-hidden rounded-xl bg-(--bg-surface-neutral) self-stretch"
      >
        <div class="w-full transition-all duration-150">
          <DatasetHistoryGroupHeader
            :date="group.date"
            :uploaded-count="group.uploadedCount"
            :total-count="group.totalCount"
            :source="group.source"
            :expanded="expandedGroups.includes(group.id)"
            @toggle="toggleGroup(group.id)"
          />
        </div>

        <Transition
          enter-from-class="max-h-0 opacity-0"
          enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
          enter-to-class="max-h-[1000px] opacity-100"
          leave-from-class="max-h-[1000px] opacity-100"
          leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="expandedGroups.includes(group.id)" class="w-full">
            <DatasetHistoryGroupContent
              :group-date="group.date"
              :sort-by="sortBy"
              :sort-order="sortOrder"
              :types="types"
              :status="status"
              :period="period"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
