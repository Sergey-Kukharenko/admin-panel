<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'AppConfirmDialog',
});

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** danger — необратимое действие (красная иконка), warning — по умолчанию */
    variant?: 'warning' | 'danger';
  }>(),
  {
    variant: 'warning',
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const { t } = useI18n({ useScope: 'global' });

// Default labels are translated: a hardcoded default stayed Russian in the English UI
const resolvedConfirmLabel = computed(() => props.confirmLabel ?? t('common.confirm'));
const resolvedCancelLabel = computed(() => props.cancelLabel ?? t('common.cancel'));
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
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex w-100 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none overflow-hidden"
        >
          <!-- Header с кнопкой close -->
          <header class="flex w-full px-5 pt-4 justify-end items-center">
            <AppButton
              variant="outline"
              size="icon"
              :aria-label="t('common.close')"
              @click="emit('close')"
            >
              <AppIcon name="close-line" />
            </AppButton>
          </header>

          <!-- Основной контейнер содержимого -->
          <div class="flex flex-col items-start gap-4 px-5 pb-1">
            <!-- Иконка предупреждения -->
            <div
              class="flex size-11 p-3 justify-center items-center rounded-(--radius-xl)"
              :class="variant === 'danger' ? 'bg-(--bg-badge-danger)' : 'bg-(--bg-warning)'"
            >
              <AppIcon
                name="spam-2-line"
                class="size-5 shrink-0"
                :class="
                  variant === 'danger' ? 'text-(--text-error)' : 'text-(--warning-foreground)'
                "
              />
            </div>

            <!-- Content блок с текстом -->
            <div class="flex flex-col items-start gap-1 self-stretch text-left">
              <DialogTitle class="text-sm font-medium text-(--text-primary) leading-5 select-none">
                {{ title }}
              </DialogTitle>
              <DialogDescription
                v-if="description"
                class="text-sm font-normal text-(--text-secondary) leading-5 select-none whitespace-pre-line"
              >
                {{ description }}
              </DialogDescription>
            </div>
          </div>

          <!-- Footer -->
          <footer
            class="flex w-full px-5 py-4 justify-end items-center gap-2 bg-(--bg-surface-primary)"
          >
            <AppButton variant="outline" size="medium" @click="emit('close')">
              {{ resolvedCancelLabel }}
            </AppButton>

            <AppButton variant="primary" size="medium" @click="emit('confirm')">
              {{ resolvedConfirmLabel }}
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
