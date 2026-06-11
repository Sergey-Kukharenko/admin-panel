<script setup lang="ts">
import { Download } from 'lucide-vue-next';

import type { DatasetTemplate } from '@/entities/Dataset/model/types.ts';
import { AppIconButton } from '@/shared/ui/AppIconButton';

defineOptions({
  name: 'DatasetTemplateItem',
});

const props = defineProps<{
  template: DatasetTemplate;
}>();

const emit = defineEmits<{
  download: [string];
}>();
</script>

<template>
  <li class="flex items-center gap-3 py-3 w-full">
    <div class="flex flex-1 flex-col gap-1">
      <h4 class="text-body-sm font-medium text-(--foreground)">
        {{ template.title }}
      </h4>

      <p class="text-body-xs text-(--muted-foreground)">
        {{ template.description }}
      </p>
    </div>

    <AppIconButton variant="ghost" @click="emit('download', props.template.id)">
      <Download class="size-4" />
    </AppIconButton>
  </li>
</template>
