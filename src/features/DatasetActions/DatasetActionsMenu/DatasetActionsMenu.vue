<script setup lang="ts">
import { Download, MoreHorizontal, Trash2 } from 'lucide-vue-next';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';

import { AppIconButton } from '@/shared/ui/AppIconButton';

defineOptions({
  name: 'DatasetActionsMenu',
});

const props = defineProps<{
  datasetId: string;
}>();

const emit = defineEmits<{
  download: [string];
  delete: [string];
}>();
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <AppIconButton variant="ghost">
        <MoreHorizontal class="size-4" />
      </AppIconButton>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      class="min-w-[180px] rounded-(--radius-md) border border-(--border) bg-white p-1 shadow-lg"
    >
      <DropdownMenuItem
        class="flex items-center gap-2 px-3 py-2"
        @select="emit('download', datasetId)"
      >
        <Download class="size-4" />
        Скачать
      </DropdownMenuItem>

      <DropdownMenuItem
        class="flex items-center gap-2 px-3 py-2 text-(--danger)"
        @select="emit('delete', datasetId)"
      >
        <Trash2 class="size-4" />
        Удалить
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>
