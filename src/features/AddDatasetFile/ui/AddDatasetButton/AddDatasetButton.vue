<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/AppButton';

defineOptions({
  name: 'AddDatasetButton',
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <AppButton variant="secondary" size="small" @click="emit('click')">
    <Plus class="size-4" />

    Добавить файл
  </AppButton>
</template>
