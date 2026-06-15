<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { DatasetTemplate } from '@/entities/Dataset/model/types';
import { DatasetTemplateIcon } from '@/entities/Dataset/ui/DatasetTemplateIcon';
import DatasetFilesList from '@/entities/Dataset/ui/DatasetTemplateItem/DatasetFilesList.vue';
import DatasetUploadZone from '@/entities/Dataset/ui/DatasetTemplateItem/DatasetUploadZone.vue';
import { AppIconButton } from '@/shared/ui/AppIconButton';

defineOptions({
  name: 'DatasetTemplateItem',
});

const props = defineProps<{
  template: DatasetTemplate;
  expanded?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  upload: [files: File[]];
  remove: [fileId: string];
}>();

const inputRef = ref<HTMLInputElement>();

const files = computed(() => props.template.files ?? []);
const filesCount = computed(() => files.value.length);

const openFilePicker = () => {
  inputRef.value?.click();
};

const handleFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files?.length) {
    return;
  }

  emit('upload', Array.from(target.files));
  target.value = '';
};
</script>

<template>
  <li class="flex w-full flex-col">
    <!-- Header -->
    <div class="flex items-center py-3">
      <!-- Content -->
      <button
        type="button"
        class="flex min-w-0 flex-1 items-start gap-3 text-left"
        @click="emit('toggle')"
      >
        <!-- Expand -->
        <ChevronRight
          class="mt-[2px] size-4 shrink-0 text-(--text-secondary) transition-transform duration-200"
          :class="{ 'rotate-90': expanded }"
        />

        <!-- Icon -->
        <div class="flex shrink-0 items-center pt-[2px]">
          <DatasetTemplateIcon :icon="template.icon" />
        </div>

        <!-- Text -->
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <div class="flex items-center gap-1">
            <h4 class="text-body-sm font-medium text-(--text-primary)">
              {{ template.title }}
            </h4>

            <span
              v-if="template.icon === 'users'"
              class="text-body-sm font-medium text-(--text-secondary)"
            >
              {{ template.count }}
            </span>
          </div>

          <p class="text-body-xs text-(--text-secondary)">
            {{ template.description }}
          </p>
        </div>
      </button>

      <!-- Actions -->
      <div class="ml-3 flex shrink-0 items-center">
        <AppIconButton variant="ghost">
          <MoreHorizontal class="size-4 text-(--text-secondary)" />
        </AppIconButton>

        <AppIconButton variant="ghost" @click="openFilePicker">
          <Plus class="size-[13.333px] text-(--text-secondary)" />
        </AppIconButton>

        <input
          ref="inputRef"
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          class="hidden"
          @change="handleFilesChange"
        />
      </div>
    </div>

    <!-- Expanded Content -->
    <div v-if="expanded" class="pb-3 pl-9">
      <DatasetUploadZone v-if="!filesCount" @upload="emit('upload', $event)" />

      <DatasetFilesList v-else :files="files" @remove="emit('remove', $event)" />
    </div>
  </li>
</template>
