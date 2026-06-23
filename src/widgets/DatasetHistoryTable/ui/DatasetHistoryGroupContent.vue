<script setup lang="ts">
import { Loader2, Users } from 'lucide-vue-next';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

// Моковые данные: 3 примера категорий согласно вашему макету
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
  <!-- Main Content: вертикальный контейнер, padding: 0 8px 8px 8px, gap: 8px -->
  <div
    class="flex flex-col items-start self-stretch w-full px-2 pb-2 gap-2 bg-[rgba(48,48,50,0.03)] rounded-b-xl"
  >
    <!-- Перебираем категории (3 примера: Users, Vip-users, Bets) -->
    <div
      v-for="category in categoriesMock"
      :key="category.id"
      class="flex flex-col items-end self-stretch w-full rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
    >
      <!-- 1. ЗАГОЛОВОК ПОДТАБЛИЦЫ (Table Header) -->
      <div class="flex h-11 pl-4 items-center self-stretch border-b border-black/8">
        <div class="flex items-center gap-2 flex-1">
          <!-- Иконка группы (Group Icon): строго 16x16, цвет с прозрачностью 68% -->
          <Users class="size-4 text-[rgba(48,48,50,0.68)] flex-shrink-0" stroke-width="2" />

          <!-- Текст названия и количества (Frame) -->
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none">
              {{ category.title }}
            </span>
            <span class="text-sm font-medium text-[rgba(48,48,50,0.57)] leading-5 select-none">
              {{ category.count }}
            </span>
          </div>
        </div>

        <!-- Пустые ячейки-заглушки в шапке категории для сохранения идеальной сетки 160px -->
        <div class="w-[160px] h-full border-l border-black/8" />
        <div class="w-[160px] h-full" />
      </div>

      <!-- 2. СТРОКИ ФАЙЛОВ (Table Rows) -->
      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex items-center self-stretch w-full border-b border-black/8 last:border-b-0 hover:bg-slate-50/50 transition-colors"
      >
        <!-- Ячейка 1: Название файла (pl-10 дает ровно 40px отступа) -->
        <div class="flex h-11 pl-10 pr-4 items-center gap-2 flex-1 border-r border-black/8 min-w-0">
          <span
            class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 truncate select-none"
          >
            {{ file.name }}
          </span>
        </div>

        <!-- Ячейка 2: Объём строк (Фиксированная ширина 160px) -->
        <div class="flex w-[160px] h-11 px-4 items-center gap-1.5 border-r border-black/8">
          <span
            class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none font-mono"
          >
            {{ file.rowsCount }}
          </span>
        </div>

        <!-- Ячейка 3: Статус (Фиксированная ширина 160px) -->
        <div class="flex w-[160px] h-11 px-4 items-center">
          <!-- StatusBadge: овальная пилюля, фон rgba(202, 220, 255, 0.40) -->
          <div
            class="flex h-[23px] pl-1.5 pr-2 py-1 items-center gap-1 rounded-full bg-[rgba(202,220,255,0.40)] select-none"
          >
            <!-- Анимированный лоадер (loader-2-line): строго 14x14px, цвет #1A0151 -->
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
