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
      <!-- Overlay с размытием 6px и фоном rgba(48, 48, 50, 0.25) -->
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
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex w-[400px] flex-col rounded-(--radius-lg) bg-white border border-(--border) shadow-[0_0_1px_0_rgba(0,0,0,0.0)_inset,0_2px_8px_0_rgba(0,0,0,0.06),0_-6px_12px_0_rgba(0,0,0,0.03),0_14px_28px_0_rgba(0,0,0,0.08)] focus:outline-none overflow-hidden"
        >
          <!-- Header с кнопкой close (32x32px) -->
          <header class="flex w-full px-5 pt-4 justify-end items-center">
            <AppButton variant="ghost" size="icon" @click="$emit('close')">
              <X />
            </AppButton>
          </header>

          <!-- Основной контейнер содержимого (width: 360px по фигме, за счёт px-5) -->
          <div class="flex flex-col items-start gap-4 px-5 pb-2">
            <!-- Иконка предупреждения: 44x44px, цвет #B29700 -->
            <div
              class="flex size-11 p-3 justify-center items-center rounded-(--radius-md) bg-[rgba(255,236,119,0.20)]"
            >
              <AlertOctagon class="size-5 text-[#B29700] flex-shrink-0" stroke-width="2" />
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

          <!-- Footer: 16px 20px (px-5 py-4), gap 8px -->
          <footer class="flex w-full px-5 py-4 justify-end items-center gap-2 bg-white">
            <AppButton variant="outline" size="medium" class="!px-4" @click="emit('close')">
              Отмена
            </AppButton>

            <AppButton
              variant="primary"
              size="medium"
              class="!px-4 text-[#FCFCFC]"
              @click="emit('confirm')"
            >
              Да, отправить
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
