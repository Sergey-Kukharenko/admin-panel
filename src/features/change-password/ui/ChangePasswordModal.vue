<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'ChangePasswordModal',
});

defineProps<{
  open: boolean;
  email: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
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
            <p class="flex-1 text-base font-medium text-(--text-primary)">Изменить пароль</p>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-4 px-5 pb-5 text-sm text-(--text-secondary)">
            <p>
              Для изменения пароля мы отправим письмо на {{ email }}. Следуйте инструкции в письме,
              чтобы задать новый пароль.
            </p>
            <p>
              Ссылка действительна в течение 1 часа. Если срок действия истечет, вы сможете
              запросить новое письмо.
            </p>
          </div>

          <footer class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4">
            <AppButton variant="outline" size="medium" @click="emit('close')"> Отмена </AppButton>

            <AppButton variant="primary" size="medium" @click="emit('confirm')">
              Отправить письмо
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
