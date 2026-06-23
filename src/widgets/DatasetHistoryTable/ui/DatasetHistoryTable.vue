<script setup lang="ts">
import { ref } from 'vue';

// Локальные импорты компонентов из текущей папки ui
import DatasetHistoryGroupContent from './DatasetHistoryGroupContent.vue';
import DatasetHistoryGroupHeader from './DatasetHistoryGroupHeader.vue';
import DatasetHistoryTableHeader from './DatasetHistoryTableHeader.vue';
import DatasetHistoryToolbar from './DatasetHistoryToolbar.vue';

defineOptions({
  name: 'DatasetHistoryTable',
});

const emit = defineEmits<{
  openUploadDrawer: []; // Пробрасываем событие клика по кнопке «Загрузить CSV» на страницу
}>();

// Моковые данные для групп по датам (2 примера для демонстрации)
const historyGroupsMock = ref([
  {
    id: 'group-1',
    date: '14 янв 2026, 03:16',
    uploadedCount: 0,
    totalCount: 3,
    source: 'CSV',
  },
  {
    id: 'group-2',
    date: '12 янв 2026, 18:42',
    uploadedCount: 3,
    totalCount: 3,
    source: 'CSV',
  },
]);

// Массив для хранения ID раскрытых аккордеонов дат
const expandedGroups = ref<string[]>(['group-1']); // Первая группа открыта по умолчанию, как на макете

const toggleGroup = (id: string) => {
  if (expandedGroups.value.includes(id)) {
    expandedGroups.value = expandedGroups.value.filter((gId) => gId !== id);
  } else {
    expandedGroups.value.push(id);
  }
};
</script>

<template>
  <!-- Контейнер таблицы: ширина 1138px по фигме, gap 32px (gap-8) -->
  <div class="flex flex-col items-start w-[1138px] gap-8 self-stretch mx-auto py-6">
    <!-- ВЕРХНЯЯ ЧАСТЬ (Панель фильтров и кнопка вызова шторки) -->
    <DatasetHistoryToolbar @open-upload="emit('openUploadDrawer')" />

    <!-- ТЕЛО ТАБЛИЦЫ: Контейнер, gap: 4px между аккордеонами дат -->
    <div class="flex flex-col w-full gap-1 self-stretch">
      <!-- Статическая шапка таблицы (НАИМЕНОВАНИЕ / ОБЪЕМ СТРОК / СТАТУС) -->
      <DatasetHistoryTableHeader />

      <!-- Перебираем группы загрузок по датам -->
      <div
        v-for="group in historyGroupsMock"
        :key="group.id"
        class="flex flex-col items-start self-stretch w-full overflow-hidden"
      >
        <!-- Строка-группировка (Заголовок аккордеона с датой и бейджами) -->
        <div
          :class="[
            'w-full transition-all duration-150',
            expandedGroups.includes(group.id)
              ? 'bg-[rgba(48,48,50,0.03)] rounded-b-none'
              : 'bg-white rounded-b-xl',
          ]"
        >
          <DatasetHistoryGroupHeader
            :date="group.date"
            :uploaded-count="group.uploadedCount"
            :total-count="group.totalCount"
            :source="group.source"
            :expanded="expandedGroups.includes(group.id)"
            @toggle="toggleGroup(group.id)"
          />
        </div>

        <!-- Раскрывающийся контент (Белые карточки категорий и файлы в статусе ЗАГРУЗКА) -->
        <Transition
          enter-from-class="max-h-0 opacity-0"
          enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
          enter-to-class="max-h-[1000px] opacity-100"
          leave-from-class="max-h-[1000px] opacity-100"
          leave-active-class="transition-all duration-200 ease-in-out overflow-hidden"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-if="expandedGroups.includes(group.id)" class="w-full rounded-b-xl">
            <DatasetHistoryGroupContent />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
