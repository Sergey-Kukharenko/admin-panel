<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';

import { AppButton } from '@/shared/ui/app-button';

export interface AppDrawerProps {
  open: boolean;
  title: string;
}

defineOptions({
  name: 'AppDrawer',
});

defineProps<AppDrawerProps>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => !value && emit('close')">
    <DialogPortal>
      <!-- Overlay -->

      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-to-class="opacity-0"
      >
        <DialogOverlay v-if="open" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[6px]" />
      </Transition>

      <!-- Drawer -->
      <Transition
        enter-from-class="translate-x-full"
        enter-active-class="transition-transform duration-300 ease-out"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-to-class="translate-x-full"
      >
        <DialogContent
          v-if="open"
          class="fixed top-0 right-0 z-50 flex h-screen w-130 flex-col border-l border-(--border) bg-(--card) shadow-xl focus:outline-none"
        >
          <!-- Header -->

          <header class="flex h-15 items-center justify-between px-5 pt-5 pb-4">
            <h2 class="text-body-md font-medium text-(--text-primary)">
              {{ title }}
            </h2>

            <AppButton variant="outline" size="icon" @click="$emit('close')">
              <X />
            </AppButton>
          </header>

          <!-- Content -->
          <section class="flex-1 overflow-y-auto px-5 pb-23">
            <slot />
          </section>

          <!-- Footer -->
          <footer v-if="$slots.footer" class="border-t border-(--border)">
            <slot name="footer" />
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
