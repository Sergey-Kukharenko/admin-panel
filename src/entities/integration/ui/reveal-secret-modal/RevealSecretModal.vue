<script setup lang="ts">
import { Copy, X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';
import { toast } from 'vue-sonner';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'RevealSecretModal',
});

const props = defineProps<{
  open: boolean;
  title: string;
  fieldLabel: string;
  warningText: string;
  secretValue: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const MASKED_SECRET = '•'.repeat(40);

async function copyAndClose() {
  await navigator.clipboard.writeText(props.secretValue);
  toast.success('Скопировано');
  emit('close');
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
            <p class="flex-1 text-base font-medium text-(--text-primary)">{{ title }}</p>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-4 px-5 pb-5">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-(--text-primary)">{{ fieldLabel }}</label>
              <div class="h-9 w-full truncate rounded-(--radius-lg) bg-(--bg-input) px-3 py-2 text-sm text-(--text-primary)">
                {{ MASKED_SECRET }}
              </div>
            </div>

            <p class="text-sm text-(--text-primary)">{{ warningText }}</p>
          </div>

          <footer class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4">
            <AppButton @click="copyAndClose">
              <Copy class="size-4" />
              Скопировать
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
