<script setup lang="ts">
import { Loader2, Users } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

const categoriesMock = [
  {
    id: 'users',
    title: 'Users',
    count: 2,
    files: [
      { id: '1', name: 'casino_rewards.csv', rowsCount: '7634', status: 'LOADING' },
      { id: '2', name: 'jackpot_winners.csv', rowsCount: '2345', status: 'LOADING' },
    ],
  },
  {
    id: 'vip-users',
    title: 'Vip-users',
    count: 1,
    files: [{ id: '3', name: 'vip_players_list.csv', rowsCount: '2345', status: 'LOADING' }],
  },
  {
    id: 'bets',
    title: 'Bets',
    count: 2,
    files: [
      { id: '4', name: 'user_bets_daily.csv', rowsCount: '12840', status: 'LOADING' },
      { id: '5', name: 'high_rollers_june.csv', rowsCount: '540', status: 'LOADING' },
    ],
  },
];
</script>

<template>
  <!-- ИСПРАВЛЕНО: добавили строго px-6, чтобы карточки контента выровнялись по бокам с шапкой таблицы -->
  <div class="flex flex-col items-start self-stretch w-full px-6 pb-2 gap-2 bg-transparent">
    <div
      v-for="category in categoriesMock"
      :key="category.id"
      class="flex flex-col items-end self-stretch w-full rounded-lg bg-white overflow-hidden border border-black/8"
    >
      <!-- Заголовок подтаблицы (Table Header) -->
      <!-- pl-4 (16px) соответствует вашему ТЗ. Правые заглушки строго по w-[160px] с border-l -->
      <div class="flex h-11 pl-4 items-center self-stretch border-b border-black/8 bg-white">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <Users class="size-4 text-[rgba(48,48,50,0.68)] flex-shrink-0" stroke-width="2" />
          <div class="flex items-center gap-1.5">
            <span
              class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none truncate"
            >
              {{ category.title }}
            </span>
            <span class="text-sm font-medium text-[rgba(48,48,50,0.57)] leading-5 select-none">
              {{ category.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Строки файлов (Table Rows) -->
      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex items-center self-stretch w-full border-b border-black/8 last:border-b-0 hover:bg-slate-50/50 transition-colors bg-white"
      >
        <!-- Ячейка 1: Наименование файла (pl-10 дает 40px отступа по вашему ТЗ) -->
        <div class="flex h-11 pl-10 pr-4 items-center flex-1 min-w-0">
          <span
            class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 truncate select-none"
          >
            {{ file.name }}
          </span>
        </div>

        <!-- Ячейка 2: Объём строк (Чистые 160px и pl-4 для идеального выравнивания под текстом шапки) -->
        <div class="flex w-[160px] h-11 pl-4 pr-3 items-center border-l border-black/8 shrink-0">
          <span
            class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none font-mono"
          >
            {{ file.rowsCount }}
          </span>
        </div>

        <!-- Ячейка 3: Статус (Чистые 160px и pl-4 для идеального выравнивания под текстом шапки) -->
        <div class="flex w-[160px] h-11 pl-4 items-center border-l border-black/8 shrink-0">
          <div
            class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-1 rounded-full bg-[rgba(202,220,255,0.40)] select-none"
          >
            <Loader2
              class="size-[14px] text-[#1A0151] animate-spin flex-shrink-0"
              stroke-width="2.5"
            />
            <span class="font-mono text-xs font-medium text-[#1A0151] leading-5 uppercase">
              Загрузка
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
