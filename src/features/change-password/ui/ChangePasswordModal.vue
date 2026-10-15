<script setup lang="ts">
import { AppButton } from '@/shared/ui/app-button';
import { AppModal } from '@/shared/ui/app-modal';

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
  <AppModal :open="open" title="Изменить пароль" @close="emit('close')">
    <div class="flex flex-col gap-4 px-5 pb-5 text-sm text-(--text-secondary)">
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
      <AppButton variant="outline" size="medium" @click="emit('close')"> Отмена </AppButton>

      <AppButton variant="primary" size="medium" @click="emit('confirm')">
        Отправить письмо
      </AppButton>
    </template>
  </AppModal>
</template>
