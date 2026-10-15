<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'RevealSecretModal',
});

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    fieldLabel: string;
    /** Текст над полем (REST: «Скопируйте API secret сейчас…») */
    description?: string;
    /** Текст под полем (S3: «Ключ больше не будет показан…») */
    warningText?: string;
    secretValue: string;
    /** Тост после копирования; без него — молча */
    copiedToast?: string;
    /** S3: копирование закрывает окно; REST: окно остаётся открытым (макет 1740:74513) */
    closeOnCopy?: boolean;
  }>(),
  { closeOnCopy: true },
);

const emit = defineEmits<{
  close: [];
}>();

const MASKED_SECRET = '•'.repeat(40);

const { t } = useI18n({ useScope: 'global' });

async function copySecret() {
  await navigator.clipboard.writeText(props.secretValue);
  if (props.copiedToast) toast.success(props.copiedToast);
  if (props.closeOnCopy) emit('close');
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
          :aria-describedby="undefined"
          class="fixed top-1/2 left-1/2 z-50 flex w-120 -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <DialogTitle class="flex-1 text-base font-medium text-(--text-primary)">{{
              title
            }}</DialogTitle>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <AppIcon name="close-line" class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-4 px-5 pb-5">
            <p v-if="description" class="text-sm whitespace-pre-line text-(--text-primary)">
              {{ description }}
            </p>

            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium text-(--text-primary)">{{ fieldLabel }}</p>
              <div
                class="h-9 w-full truncate rounded-(--radius-lg) bg-(--bg-input) px-3 py-2 text-sm text-(--text-primary)"
              >
                {{ MASKED_SECRET }}
              </div>
            </div>

            <p v-if="warningText" class="text-sm text-(--text-primary)">{{ warningText }}</p>
          </div>

          <footer class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4">
            <AppButton @click="copySecret">
              <AppIcon name="file-copy-line" class="size-4" />
              {{ t('integrations.credentials.copy') }}
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
