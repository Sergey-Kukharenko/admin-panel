<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';

import { AppIconButton } from '@/shared/ui/app-icon-button';

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

defineProps<{
  open: boolean;
  title?: string;
  details: ErrorDetails | null;
}>();

const emit = defineEmits<{
  close: [];
  download: [];
}>();
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => !value && emit('close')">
    <DialogPortal>
      <!-- Overlay с размытием 6px и фоном из дизайн-системы -->
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
          class="fixed inset-0 z-50 bg-[rgba(48,48,50,0.25)] backdrop-blur-[6px]"
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
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex w-[400px] flex-col rounded-[var(--radius-md)] bg-[var(--background)] border border-[var(--border-default)] shadow-[0_2px_8px_0_rgba(0,0,0,0.06),0_14px_28px_0_rgba(0,0,0,0.08)] focus:outline-none overflow-hidden"
        >
          <!-- Header (padding: 16px 20px) -->
          <header
            class="flex w-full px-5 py-4 justify-between items-center bg-[var(--background)] select-none"
          >
            <DialogTitle
              class="font-sans text-base font-medium leading-6 text-[var(--text-primary)]"
            >
              {{ title || 'Ошибки валидации' }}
            </DialogTitle>

            <AppIconButton
              variant="ghost"
              class="!h-8 !w-8 !p-2 !rounded-[var(--lg,8px)] border border-[var(--border-default)]"
              @click="emit('close')"
            >
              <X class="w-4 h-4 text-[var(--text-primary)]" />
            </AppIconButton>
          </header>

          <!-- Content container: padding 0 20px 72px 20px согласно стилям figma -->
          <div class="flex flex-col items-start px-5 pb-[72px] w-full box-border">
            <!-- Popup list (Frame 2147226292 -> gap 8px) -->
            <div v-if="details" class="flex flex-col items-start gap-2 w-full">
              <!-- 1. Дата загрузки -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Дата загрузки
                </span>
                <span class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)]">
                  {{ details.uploadDate }}
                </span>
              </div>

              <!-- 2. Файл (Вывод списка файлов друг под другом) -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Файл
                </span>
                <div class="flex flex-col flex-1 min-w-0">
                  <span
                    v-for="(name, index) in details.fileNames"
                    :key="index"
                    class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)] break-all"
                  >
                    {{ name }}
                  </span>
                </div>
              </div>

              <!-- 3. Тип данных -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Тип данных
                </span>
                <span class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)]">
                  {{ details.dataType }}
                </span>
              </div>

              <!-- 4. Проверено строк -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Проверено строк
                </span>
                <span
                  class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)] font-mono"
                >
                  {{ details.checkedRows }}
                </span>
              </div>

              <!-- 5.  Колонок с ошибками -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Колонок с ошибками
                </span>
                <span
                  class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)] font-mono"
                >
                  {{ details.errorColumns }}
                </span>
              </div>

              <!-- 6. Найдено ошибок -->
              <div class="flex w-full items-start gap-3 min-h-6 py-0.5">
                <span
                  class="w-[164px] shrink-0 font-sans text-sm font-normal leading-5 text-[var(--text-secondary)]"
                >
                  Найдено ошибок
                </span>
                <span
                  class="font-sans text-sm font-normal leading-5 text-[var(--text-primary)] font-mono"
                >
                  {{ details.errorsFound }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer: Кнопка «Скачать файл» со скруглением 16px (flex: 1 0 0) -->
          <footer class="flex w-full px-5 py-4 justify-end items-center bg-[var(--background)]">
            <button
              type="button"
              class="flex h-9 items-center justify-center gap-2 px-4 py-2 flex-1 rounded-[var(--radius-lg)] bg-[var(--primary)] text-[var(--primary-foreground)] font-sans text-sm font-medium leading-5 hover:opacity-90 transition-opacity outline-none"
              @click="emit('download')"
            >
              Скачать файл
            </button>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
