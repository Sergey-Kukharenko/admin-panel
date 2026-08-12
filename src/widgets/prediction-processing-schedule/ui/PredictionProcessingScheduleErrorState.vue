<script setup lang="ts">
import { AlertOctagon } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'PredictionProcessingScheduleErrorState',
});

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <aside
    class="w-[332px] shrink-0 flex flex-col items-center justify-center gap-3 rounded-(--radius-xl) bg-[var(--bg-surface-neutral)] px-5 py-8 text-center"
  >
    <AlertOctagon class="size-5 text-(--danger-failed)" stroke-width="2" />
    <p class="text-sm font-medium leading-5 text-(--text-primary)">
      Не удалось загрузить расписание
    </p>
    <AppButton variant="outline" size="small" @click="$emit('retry')">Повторить</AppButton>
  </aside>
</template>
