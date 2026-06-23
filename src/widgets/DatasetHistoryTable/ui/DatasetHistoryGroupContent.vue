<script setup lang="ts">
import { Loader2, Users } from 'lucide-vue-next';
import { computed } from 'vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

const props = defineProps<{
  sortBy: 'rows' | null;
  sortOrder: 'asc' | 'desc';
}>();

const categoriesMock = [
  {
    id: 'users',
    title: 'Users',
    count: 2,
    files: [
      { id: '1', name: 'casino_rewards.csv', rowsCount: 7634, status: 'LOADING' },
      { id: '2', name: 'jackpot_winners.csv', rowsCount: 2345, status: 'SUCCESS' },
    ],
  },
  {
    id: 'vip-users',
    title: 'Vip-users',
    count: 1,
    files: [{ id: '3', name: 'vip_players_list.csv', rowsCount: 5420, status: 'LOADING' }],
  },
  {
    id: 'bets',
    title: 'Bets',
    count: 2,
    files: [
      { id: '4', name: 'user_bets_daily.csv', rowsCount: 12840, status: 'SUCCESS' },
      { id: '5', name: 'high_rollers_june.csv', rowsCount: 540, status: 'ERROR' },
    ],
  },
];

const sortedCategories = computed(() => {
  return categoriesMock.map((category) => {
    const sortedFiles = [...category.files].sort((a, b) => {
      // Сортируем только если выбран режим 'rows'
      if (props.sortBy !== 'rows') return 0;

      const comparison = a.rowsCount - b.rowsCount;
      return props.sortOrder === 'desc' ? -comparison : comparison;
    });
    return { ...category, files: sortedFiles };
  });
});
</script>

<template>
  <div class="flex w-full flex-col items-start gap-2 bg-transparent px-6 pb-2 self-stretch">
    <div
      v-for="category in sortedCategories"
      :key="category.id"
      class="flex w-full flex-col items-end overflow-hidden rounded-lg border border-black/8 bg-white self-stretch"
    >
      <!-- Заголовок подтаблицы -->
      <div class="flex h-11 w-full items-center border-b border-black/8 bg-white pl-4 self-stretch">
        <div class="flex flex-1 min-w-0 items-center gap-2">
          <Users class="size-4 shrink-0 text-[rgba(48,48,50,0.68)]" stroke-width="2" />
          <div class="flex items-center gap-1.5 truncate">
            <span class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none">
              {{ category.title }}
            </span>
            <span class="text-sm font-medium text-[rgba(48,48,50,0.57)] leading-5 select-none">
              {{ category.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Строки файлов -->
      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex w-full items-center border-b border-black/8 bg-white last:border-b-0 hover:bg-slate-50/50 transition-colors self-stretch"
      >
        <div class="flex h-11 flex-1 min-w-0 items-center gap-2 border-r border-black/8 pl-10 pr-4">
          <span
            class="truncate text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none"
          >
            {{ file.name }}
          </span>
        </div>

        <div class="flex h-11 w-[160px] shrink-0 items-center border-r border-black/8 pl-4 pr-3">
          <span
            class="font-mono text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none"
          >
            {{ file.rowsCount }}
          </span>
        </div>

        <div class="flex h-11 w-[160px] shrink-0 items-center pl-4 pr-3">
          <div
            v-if="file.status === 'LOADING'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-[rgba(202,220,255,0.40)] pl-1.5 pr-2 py-1 select-none"
          >
            <Loader2 class="size-[14px] shrink-0 text-[#1A0151] animate-spin" stroke-width="2.5" />
            <span class="font-mono text-xs font-medium uppercase text-[#1A0151] leading-5"
              >Загрузка</span
            >
          </div>

          <div
            v-else-if="file.status === 'SUCCESS'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-emerald-50 pl-1.5 pr-2 py-1 select-none"
          >
            <span class="font-mono text-xs font-medium uppercase text-emerald-700 leading-5"
              >Успешно</span
            >
          </div>

          <div
            v-else
            class="flex h-[23px] items-center gap-1 rounded-full bg-red-50 pl-1.5 pr-2 py-1 select-none"
          >
            <span class="font-mono text-xs font-medium uppercase text-red-700 leading-5"
              >Ошибка</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
