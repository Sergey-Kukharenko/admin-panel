<script setup lang="ts">
import { ref } from 'vue';

import DatasetHistoryGroupContent from './DatasetHistoryGroupContent.vue';
import DatasetHistoryGroupHeader from './DatasetHistoryGroupHeader.vue';
import DatasetHistoryTableHeader from './DatasetHistoryTableHeader.vue';
import DatasetHistoryToolbar from './DatasetHistoryToolbar.vue';

defineOptions({
  name: 'DatasetHistoryTable',
});

defineEmits<{
  openUploadDrawer: [];
}>();

const historyGroupsMock = ref([
  { id: 'group-1', date: '14 янв 2026, 03:16', uploadedCount: 0, totalCount: 3, source: 'CSV' },
  { id: 'group-2', date: '12 янв 2026, 18:42', uploadedCount: 3, totalCount: 3, source: 'CSV' },
]);

const expandedGroups = ref<string[]>(['group-1']);

const toggleGroup = (id: string) => {
  if (expandedGroups.value.includes(id)) {
    expandedGroups.value = expandedGroups.value.filter((gId) => gId !== id);
  } else {
    expandedGroups.value.push(id);
  }
};
</script>

<template>
  <div class="flex flex-col items-start w-[1138px] gap-8 self-stretch mx-auto py-6">
    <DatasetHistoryToolbar @open-upload="$emit('openUploadDrawer')" />

    <div class="flex flex-col w-full gap-1 self-stretch">
      <DatasetHistoryTableHeader />

      <div
        v-for="group in historyGroupsMock"
        :key="group.id"
        class="flex flex-col items-center w-full bg-[rgba(48,48,50,0.03)] rounded-xl self-stretch overflow-hidden"
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
            <DatasetHistoryGroupContent />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
