<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

import type { AppModalSize } from './AppModal.types';

const props = withDefaults(
  defineProps<{
    title: string;
    size?: AppModalSize;
  }>(),
  {
    size: 'md',
  },
);

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n({ useScope: 'global' });

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-100';
    case 'lg':
      return 'w-180';
    case 'md':
    default:
      return 'w-120';
  }
});
</script>

<template>
  <DialogRoot v-model:open="open">
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
        <!-- No DialogDescription by default: the body is free-form, so aria-describedby is opted out -->
        <DialogContent
          v-if="open"
          :aria-describedby="undefined"
          class="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
          :class="sizeClass"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <DialogTitle class="flex-1 text-sm font-medium text-(--text-primary)">
              {{ title }}
            </DialogTitle>

            <AppButton
              variant="outline"
              size="icon"
              :aria-label="t('common.close')"
              @click="open = false"
            >
              <AppIcon name="close-line" class="size-4" />
            </AppButton>
          </header>

          <div class="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2">
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
