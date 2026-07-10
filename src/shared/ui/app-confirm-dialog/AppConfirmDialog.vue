<script setup lang="ts">
import { AlertOctagon, X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'AppConfirmDialog',
});

defineProps<{
  open: boolean;
  title: string;
  description?: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
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
          class="fixed inset-0 z-50 bg-(--overlay) backdrop-blur-(--blur-overlay)"
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
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex w-100 flex-col rounded-lg bg-(--surface) border border-(--border) shadow-(--shadow-panel) focus:outline-none overflow-hidden"
        >
          <!-- Header с кнопкой close -->
          <header class="flex w-full px-5 pt-4 justify-end items-center">
            <AppButton variant="outline" size="icon" @click="$emit('close')">
              <X />
            </AppButton>
          </header>

          <!-- Основной контейнер содержимого -->
          <div class="flex flex-col items-start gap-4 px-5 pb-2">
            <!-- Иконка предупреждения -->
            <div
              class="flex size-11 p-3 justify-center items-center rounded-md bg-(--warning-muted)"
            >
              <AlertOctagon class="size-5 text-(--warning-foreground) shrink-0" stroke-width="2" />
            </div>

            <!-- Content блок с текстом -->
            <div class="flex flex-col items-start gap-1 self-stretch text-left">
              <h3 class="text-sm font-medium text-(--text-primary) leading-5 select-none">
                {{ title }}
              </h3>
              <p
                v-if="description"
                class="text-sm font-normal text-(--text-secondary) leading-5 select-none"
              >
                {{ description }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <footer class="flex w-full px-5 py-4 justify-end items-center gap-2 bg-(--surface)">
            <AppButton variant="outline" size="medium" @click="emit('close')"> Отмена </AppButton>

            <AppButton
              variant="primary"
              size="medium"
              class="text-(--text-inverse-soft)"
              @click="emit('confirm')"
            >
              Подтвердить
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
