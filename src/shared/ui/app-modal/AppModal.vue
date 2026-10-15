<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

import type { AppModalProps } from './AppModal.types';

defineOptions({
  name: 'AppModal',
});

const props = withDefaults(defineProps<AppModalProps>(), {
  title: undefined,
  size: 'md',
  overlay: 'strong',
  hasDescription: false,
});

const emit = defineEmits<{
  close: [];
}>();

defineSlots<{
  default(): unknown;
  footer?(): unknown;
}>();

const { t } = useI18n({ useScope: 'global' });

const overlayClasses = computed(() =>
  props.overlay === 'soft'
    ? ['z-50', 'bg-(--overlay)', 'backdrop-blur-overlay']
    : ['z-40', 'bg-(--overlay-strong)', 'backdrop-blur-(--blur-overlay)'],
);

const sizeClasses = computed(() => (props.size === 'sm' ? 'w-100' : 'w-120'));

const headerClasses = computed(() => (props.title ? ['gap-2', 'py-4'] : ['justify-end', 'pt-4']));

// Radix предупреждает, если у диалога нет описания; без DialogDescription атрибут снимаем явно
const contentAttrs = computed(() =>
  props.hasDescription ? {} : { 'aria-describedby': undefined },
);
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
        <DialogOverlay v-if="open" class="fixed inset-0" :class="overlayClasses" />
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
          v-bind="contentAttrs"
          class="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
          :class="sizeClasses"
        >
          <header class="flex w-full shrink-0 items-center px-5" :class="headerClasses">
            <DialogTitle v-if="title" class="flex-1 text-base font-medium text-(--text-primary)">
              {{ title }}
            </DialogTitle>

            <AppButton
              variant="outline"
              size="icon"
              :aria-label="t('modal.close')"
              @click="emit('close')"
            >
              <AppIcon name="close-line" />
            </AppButton>
          </header>

          <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4"
          >
            <slot name="footer" />
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
