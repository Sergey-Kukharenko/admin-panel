<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { computed, ref } from 'vue';

import { useDatasetHistoryFilters } from '@/widgets/dataset-history-table/model';

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

const { types, status, period } = useDatasetHistoryFilters();

const expandedGroups = ref(['group-1']);

const sortBy = ref<'rows' | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');

const historyGroupsMock = ref([
  {
    id: 'group-1',
    date: '29 Jun 2026, 03:16',
    uploadedCount: 1,
    totalCount: 3,
    source: 'CSV',
    categories: [
      {
        id: 'users',
        title: 'Users',
        count: 2,
        files: [
          { id: '1', name: 'casino_rewards.csv', rowsCount: 7634, status: 'uploaded' },
          { id: '2', name: 'jackpot_winners.csv', rowsCount: 2345, status: 'uploaded' },
        ],
      },
      {
        id: 'vip-users',
        title: 'Vip-users',
        count: 1,
        files: [{ id: '3', name: 'vip_players_list.csv', rowsCount: 5420, status: 'processing' }],
      },
      {
        id: 'bets',
        title: 'Bets',
        count: 2,
        files: [
          { id: '4', name: 'withdrawal_requests.csv', rowsCount: 1208, status: 'processing' },
          { id: '5', name: 'bets.csv', rowsCount: 890, status: 'error' },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    date: '10 Jun 2026, 09:12',
    uploadedCount: 3,
    totalCount: 3,
    source: 'CSV',
    categories: [
      {
        id: 'users',
        title: 'Users',
        count: 1,
        files: [{ id: '6', name: 'users.csv', rowsCount: 500, status: 'uploaded' }],
      },
    ],
  },
]);

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

const handleSortRows = () => {
  sortBy.value = 'rows';

  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
};
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
      <DatasetHistoryTableHeader @sort-rows="handleSortRows" />

      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="flex w-full flex-col items-center overflow-hidden rounded-xl bg-[rgba(48,48,50,0.03)] self-stretch"
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
