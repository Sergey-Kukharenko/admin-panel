<script setup lang="ts">
import dayjs from 'dayjs';
import { Loader2, Users } from 'lucide-vue-next';
import { computed, ref } from 'vue';

// Импортируем типы из вашей бизнес-модели
import type { DatasetPeriod, DatasetSort, DatasetSortOrder, DatasetStatus } from '../model/types';
// Относительный импорт локального диалога из папки ui виджета
import DatasetHistoryErrorDialog, { type ErrorDetails } from './DatasetHistoryErrorDialog.vue';

defineOptions({
  name: 'DatasetHistoryGroupContent',
});

// Строгие внутренние интерфейсы для полной типизации без any
interface DatasetHistoryFile {
  id: string;
  name: string;
  rowsCount: number;
  status: DatasetStatus;
  errorMessage?: string;
}

interface DatasetCategory {
  id: string;
  title: string;
  count: number;
  files: DatasetHistoryFile[];
}

const props = defineProps<{
  sortBy: DatasetSort;
  sortOrder: DatasetSortOrder;
  status: DatasetStatus | '';
  period: DatasetPeriod | '';
  types: string[];
  groupDate: string; // Строка формата "14 янв 2026"
}>();

// Управление состоянием окна ошибок со строгими типами
const isErrorDialogOpen = ref<boolean>(false);
const selectedErrorDetails = ref<ErrorDetails | null>(null);

// Типизированный мок-массив данных
const categoriesMock: DatasetCategory[] = [
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
      {
        id: '5',
        name: 'high_rollers_june.csv',
        rowsCount: 540,
        status: 'ERROR',
      },
    ],
  },
];

// Функция теперь принимает реальный объект файла и динамически прокидывает его имя
function handleOpenErrorDetails(file: DatasetHistoryFile, categoryTitle: string): void {
  selectedErrorDetails.value = {
    // Подставляем дату текущей группы, переданную через пропсы
    uploadDate: `${props.groupDate}, 03:16`,

    // Передаем в массив строго имя того файла, по которому кликнули!
    fileNames: [file.name],

    // Приводим категорию к нижнему регистру (например, "bets" или "users")
    dataType: categoryTitle.toLowerCase(),

    // Передаем реальный объем строк именно этого файла
    checkedRows: file.rowsCount,

    // Временная статика из макета (после подключения API заменится на file.errorColumnsCount)
    errorColumns: 3,
    errorsFound: 3,
  };
  isErrorDialogOpen.value = true;
}

// Обработчик скачивания отчета об ошибках
function handleDownloadErrorFile(): void {
  if (!selectedErrorDetails.value) return;
  console.log('Запуск скачивания файла ошибок для:', selectedErrorDetails.value.fileNames);
}

function checkPeriod(date: string, period: string): boolean {
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

const visibleCategories = computed<DatasetCategory[]>(() => {
  if (!checkPeriod(props.groupDate, props.period)) {
    return [];
  }

  return categoriesMock
    .map((category) => {
      let files = [...category.files];

      if (props.types.length && !props.types.includes(category.id)) {
        files = [];
      }

      if (props.status) {
        files = files.filter((file) => file.status === props.status);
      }

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
      <!-- Заголовок категории группы -->
      <div
        class="flex h-11 w-full items-center border-b border-[var(--border-default)] bg-white pl-4"
      >
        <div class="flex flex-1 min-w-0 items-center gap-2">
          <Users class="w-4 h-4 shrink-0 text-[var(--text-secondary)]" :stroke-width="2" />

          <div class="flex items-center gap-1.5 truncate">
            <span class="text-sm font-medium text-[var(--text-primary)]">
              {{ category.title }}
            </span>

            <span class="text-sm font-medium text-[rgba(48,48,50,0.57)]">
              {{ category.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- Список файлов внутри категории -->
      <div
        v-for="file in category.files"
        :key="file.id"
        class="flex w-full items-center border-b border-[var(--border-default)] bg-white last:border-b-0 hover:bg-slate-50/50 transition-colors"
      >
        <div
          class="flex h-11 flex-1 items-center border-r border-[var(--border-default)] pl-10 pr-4"
        >
          <span class="truncate text-sm font-medium text-[var(--text-primary)]">
            {{ file.name }}
          </span>
        </div>

        <div class="flex h-11 w-[160px] items-center border-r border-[var(--border-default)] pl-4">
          <span class="font-mono text-sm font-medium text-[var(--text-primary)]">
            {{ file.rowsCount }}
          </span>
        </div>

        <!-- Контейнер статуса -->
        <div class="flex h-11 w-[160px] items-center pl-4">
          <!-- Загрузка -->
          <div
            v-if="file.status === 'LOADING'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-[rgba(202,220,255,0.40)] px-2 select-none"
          >
            <Loader2 class="w-[14px] h-[14px] animate-spin text-[#1A0151]" :stroke-width="2.5" />
            <span class="text-xs uppercase text-[#1A0151]"> Загрузка </span>
          </div>

          <!-- Успешно -->
          <div
            v-else-if="file.status === 'SUCCESS'"
            class="flex h-[23px] items-center gap-1 rounded-full bg-[var(--color-green-100)] px-2 select-none"
          >
            <span class="text-xs uppercase text-[var(--success)]"> Успешно </span>
          </div>

          <!-- Ошибка (Кликабельный тег) -->
          <div
            v-else
            class="flex h-[23px] items-center gap-1 rounded-full bg-[var(--color-red-200)]/40 px-2 cursor-pointer hover:bg-[var(--color-red-200)]/60 active:scale-95 transition-all select-none"
            @click="handleOpenErrorDetails(file, category.title)"
          >
            <span class="text-xs uppercase text-[var(--danger)] font-medium"> Ошибка </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Модальное окно деталей ошибки из Figma-макета -->
  <DatasetHistoryErrorDialog
    :open="isErrorDialogOpen"
    :details="selectedErrorDetails"
    @close="isErrorDialogOpen = false"
    @download="handleDownloadErrorFile"
  />
</template>
