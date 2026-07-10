<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { computed } from 'vue';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'DatasetHistoryErrorDialog',
});

export interface ErrorDetails {
  uploadDate: string;
  fileNames: string[];
  dataType: string;
  checkedRows: number;
  errorColumns: number;
  errorsFound: number;
}

const props = defineProps<{
  open: boolean;
  title?: string;
  details: ErrorDetails | null;
}>();

const emit = defineEmits<{
  close: [];
  download: [];
}>();

const detailsRows = computed(() => {
  if (!props.details) {
    return [];
  }

  return [
    {
      label: 'Дата загрузки',
      value: props.details.uploadDate,
    },
    {
      label: 'Файл',
      value: props.details.fileNames,
    },
    {
      label: 'Тип данных',
      value: props.details.dataType,
    },
    {
      label: 'Проверено строк',
      value: props.details.checkedRows,
    },
    {
      label: 'Колонок с ошибками',
      value: props.details.errorColumns,
    },
    {
      label: 'Найдено ошибок',
      value: props.details.errorsFound,
    },
  ];
});
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => !value && emit('close')">
    <DialogPortal>
      <!-- Overlay с размытием -->
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <DialogOverlay
          v-if="open"
          class="fixed inset-0 z-50 bg-(--overlay) backdrop-blur-overlay"
        />
      </Transition>

      <!-- Контент модального окна -->
      <Transition
        enter-from-class="opacity-0 scale-95"
        enter-active-class="transition-all duration-200 ease-out"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-to-class="opacity-0 scale-95"
      >
        <DialogContent
          v-if="open"
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex w-100 flex-col rounded-md bg-(--background) border border-(--border-default) shadow-(--shadow-panel-short) focus:outline-none overflow-hidden"
        >
          <!-- Header -->
          <header
            class="flex w-full px-5 py-4 justify-between items-center bg-(--background) select-none"
          >
            <DialogTitle class="font-sans text-base font-medium leading-6 text-(--text-primary)">
              {{ title || 'Ошибки валидации' }}
            </DialogTitle>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X />
            </AppButton>
          </header>

          <!-- Content container -->
          <div class="flex flex-col items-start px-5 pb-18 w-full box-border">
            <div v-if="detailsRows.length" class="flex flex-col items-start gap-2 w-full">
              <div
                v-for="row in detailsRows"
                :key="row.label"
                class="flex w-full items-start gap-3 min-h-6 py-0.5"
              >
                <span
                  class="w-41 shrink-0 font-sans text-sm font-normal leading-5 text-(--text-secondary)"
                >
                  {{ row.label }}
                </span>

                <div v-if="Array.isArray(row.value)" class="flex flex-col flex-1 min-w-0">
                  <span
                    v-for="name in row.value"
                    :key="name"
                    class="font-sans text-sm font-normal leading-5 text-(--text-primary) break-all"
                  >
                    {{ name }}
                  </span>
                </div>

                <span v-else class="font-sans text-sm font-normal leading-5 text-(--text-primary)">
                  {{ row.value }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer: Кнопка «Скачать файл» со скруглением -->
          <footer class="flex w-full px-5 py-4 justify-end items-center bg-(--background)">
            <AppButton class="flex-1" variant="primary" size="medium" @click="emit('download')">
              Скачать файл
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
