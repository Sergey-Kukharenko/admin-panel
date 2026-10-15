<script setup lang="ts">
import { DialogDescription, DialogTitle } from 'radix-vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppModal } from '@/shared/ui/app-modal';

defineOptions({
  name: 'AppConfirmDialog',
});

withDefaults(
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
    description: undefined,
    confirmLabel: undefined,
    cancelLabel: undefined,
    variant: 'warning',
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppModal
    :open="open"
    size="sm"
    overlay="soft"
    :has-description="!!description"
    @close="emit('close')"
  >
    <div class="flex flex-col items-start gap-4 px-5 pb-1">
      <!-- Иконка предупреждения -->
      <div
        class="flex size-11 p-3 justify-center items-center rounded-(--radius-xl)"
        :class="variant === 'danger' ? 'bg-(--bg-badge-danger)' : 'bg-(--warning-muted)'"
      >
        <AppIcon
          name="spam-2-line"
          class="size-5 shrink-0"
          :class="variant === 'danger' ? 'text-(--text-error)' : 'text-(--warning-foreground)'"
        />
      </div>

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

    <template #footer>
      <AppButton variant="outline" size="medium" @click="emit('close')">
        {{ cancelLabel ?? t('confirmDialog.cancel') }}
      </AppButton>

      <AppButton
        variant="primary"
        size="medium"
        class="text-(--text-inverse-soft)"
        @click="emit('confirm')"
      >
        {{ confirmLabel ?? t('confirmDialog.confirm') }}
      </AppButton>
    </template>
  </AppModal>
</template>
