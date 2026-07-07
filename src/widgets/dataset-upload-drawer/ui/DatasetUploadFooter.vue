<script setup lang="ts">
import { AppButton } from '@/shared/ui/app-button';

defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  submit: [];
}>();
</script>

<template>
  <div class="flex items-center justify-end w-full h-19 px-5 py-4 gap-2 bg-(--background)">
    <AppButton variant="outline" size="medium" @click="emit('cancel')"> Отмена </AppButton>

    <AppButton variant="primary" size="medium" :disabled="disabled" @click="emit('submit')">
      Загрузить и обработать
    </AppButton>
  </div>
</template>
