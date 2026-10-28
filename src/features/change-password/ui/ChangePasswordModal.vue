<script setup lang="ts">
import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

defineProps<{
  email: string;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <AppModal v-model:open="open" title="Изменить пароль" title-size="md">
    <div class="flex flex-col gap-4 pb-3 text-sm text-(--text-secondary)">
      <p>
        Для изменения пароля мы отправим письмо на {{ email }}. Следуйте инструкции в письме, чтобы
        задать новый пароль.
      </p>
      <p>
        Ссылка действительна в течение 1 часа. Если срок действия истечет, вы сможете запросить
        новое письмо.
      </p>
    </div>

    <template #footer>
      <AppButton variant="outline" size="medium" @click="open = false">Отмена</AppButton>

      <AppButton variant="primary" size="medium" @click="emit('confirm')">
        Отправить письмо
      </AppButton>
    </template>
  </AppModal>
</template>
