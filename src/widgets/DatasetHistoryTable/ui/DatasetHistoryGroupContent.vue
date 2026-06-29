<script setup lang="ts">
import dayjs from 'dayjs';
import { Loader2, Users } from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

const props = defineProps<{
  sortBy: 'rows' | null;
  sortOrder: 'asc' | 'desc';

  types: string[];
  status: string;
  period: string;

  // дата группы (из DatasetHistoryTable)
  groupDate: string;
}>();

const categoriesMock = [
  {
    id: 'users',
    title: 'Users',
    count: 2,
    files: [
      {
        id: '1',
        name: 'casino_rewards.csv',
        rowsCount: 7634,
        status: 'LOADING',
      },
      {
        id: '2',
        name: 'jackpot_winners.csv',
        rowsCount: 2345,
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'vip-users',
    title: 'Vip-users',
    count: 1,
    files: [
      {
        id: '3',
        name: 'vip_players_list.csv',
        rowsCount: 5420,
        status: 'LOADING',
      },
    ],
  },
  {
    id: 'bets',
    title: 'Bets',
    count: 2,
    files: [
      {
        id: '4',
        name: 'user_bets_daily.csv',
        rowsCount: 12840,
        status: 'SUCCESS',
      },
      {
        id: '5',
        name: 'high_rollers_june.csv',
        rowsCount: 540,
        status: 'ERROR',
      },
    ],
  },
];

function checkPeriod(date: string, period: string) {
  if (!period) return true;

  const created = dayjs(date, 'DD MMM YYYY, HH:mm');
  const now = dayjs();

  switch (period) {
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

const visibleCategories = computed(() => {
  // если группа не попадает под выбранный период — ничего не отображаем
  if (!checkPeriod(props.groupDate, props.period)) {
    return [];
  }

  return categoriesMock
    .map((category) => {
      let files = [...category.files];

      // фильтр по типу данных
      if (props.types.length && !props.types.includes(category.id)) {
        files = [];
      }

      // фильтр по статусу
      if (props.status) {
        files = files.filter((file) => file.status === props.status);
      }

      // сортировка
      if (props.sortBy === 'rows') {
        files.sort((a, b) => {
          const diff = a.rowsCount - b.rowsCount;
          return props.sortOrder === 'desc' ? -diff : diff;
        });
      }

      return {
        ...category,
        count: files.length,
        files,
      };
    })
    .filter((category) => category.files.length);
});
</script>

<template>
  <div
    v-if="visibleCategories.length"
    class="flex w-full flex-col items-start gap-2 bg-transparent px-2 pb-2 self-stretch"
  >
    <div
      v-for="category in visibleCategories"
      :key="category.id"
      class="flex w-full flex-col items-end overflow-hidden rounded-lg bg-white self-stretch"
    >
      <div class="flex h-11 w-full items-center border-b border-black/8 bg-white pl-4">
        <div class="flex flex-1 min-w-0 items-center gap-2">
          <Users class="size-4 shrink-0 text-[rgba(48,48,50,0.68)]" stroke-width="2" />

          <div class="flex items-center gap-1.5 truncate">
            <span class="text-sm font-medium text-[rgba(48,48,50,0.98)]">
              {{ category.title }}
            </span>

            <span class="text-sm font-medium text-[rgba(48,48,50,0.57)]">
              {{ category.count }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex w-full items-center border-b border-black/8 bg-white last:border-b-0 hover:bg-slate-50/50 transition-colors"
      >
        <div class="flex h-11 flex-1 items-center border-r border-black/8 pl-10 pr-4">
          <span class="truncate text-sm font-medium text-[rgba(48,48,50,0.98)]">
            {{ file.name }}
          </span>
        </div>

        <div class="flex h-11 w-[160px] items-center border-r border-black/8 pl-4">
          <span class="font-mono text-sm font-medium text-[rgba(48,48,50,0.98)]">
            {{ file.rowsCount }}
          </span>
        </div>

        <div class="flex h-11 w-[160px] items-center pl-4">
          <div
            v-if="file.status === 'LOADING'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-[rgba(202,220,255,0.40)] px-2"
          >
            <Loader2 class="size-[14px] animate-spin text-[#1A0151]" stroke-width="2.5" />
            <span class="text-xs uppercase text-[#1A0151]"> Загрузка </span>
          </div>

          <div
            v-else-if="file.status === 'SUCCESS'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-emerald-50 px-2"
          >
            <span class="text-xs uppercase text-emerald-700"> Успешно </span>
          </div>

          <div v-else class="flex h-[23px] items-center gap-1 rounded-full bg-red-50 px-2">
            <span class="text-xs uppercase text-red-700"> Ошибка </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
