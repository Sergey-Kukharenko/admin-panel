<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';
import { ref } from 'vue';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'S3ConnectionModal',
});

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const organization = ref('');

function handleSubmit() {
  // TODO: заменить на реальный вызов API, когда появится backend-эндпоинт заявок на подключение.
  emit('submit');
}
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => !value && emit('close')">
    <DialogPortal>
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
          class="fixed inset-0 z-40 bg-(--overlay-strong) backdrop-blur-(--blur-overlay)"
        />
      </Transition>

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
          class="fixed top-1/2 left-1/2 z-50 flex w-120 -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <p class="flex-1 text-sm font-medium text-(--text-primary)">Подключение Amazon S3</p>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-5 px-5 pb-2">
            <p class="text-sm text-(--text-secondary)">Ознакомьтесь с параметрами заявки.</p>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-(--text-primary)">Организация</label>
              <input
                v-model="organization"
                type="text"
                placeholder="New_Casino"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent)"
              />
            </div>

            <div class="flex flex-col gap-1 pb-4">
              <label class="text-sm font-medium text-(--text-primary)">Тип подключения</label>
              <input
                value="S3"
                disabled
                type="text"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-secondary) outline-none disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <footer
            class="flex w-full shrink-0 items-center justify-end gap-2 border-t border-(--border-default) px-5 py-4"
          >
            <AppButton variant="outline" @click="emit('close')">Отмена</AppButton>
            <AppButton @click="handleSubmit">Запросить подключение</AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
