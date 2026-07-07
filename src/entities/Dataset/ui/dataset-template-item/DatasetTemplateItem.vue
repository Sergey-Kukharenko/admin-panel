<script setup lang="ts">
import { ChevronRight, Download, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { DatasetTemplate } from '@/entities/dataset/model/types';
import { DatasetTemplateIcon } from '@/entities/dataset/ui/dataset-template-icon';
import DatasetFilesList from '@/entities/dataset/ui/dataset-template-item/DatasetFilesList.vue';
import DatasetUploadZone from '@/entities/dataset/ui/dataset-template-item/DatasetUploadZone.vue';
import { AppButton } from '@/shared/ui/app-button';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

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
  clearAll: [];
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
        class="flex min-w-0 flex-1 items-start gap-2 text-left"
        @click="emit('toggle')"
      >
        <div class="flex gap-1">
          <!-- Expand -->
          <ChevronRight
            class="mt-0.5 size-4 shrink-0 text-(--text-secondary) transition-transform duration-200"
            :class="{ 'rotate-90': expanded }"
          />

          <!-- Icon -->
          <div class="flex shrink-0 items-center pt-0.5">
            <DatasetTemplateIcon :icon="template.icon" />
          </div>
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
      <div class="ml-3 flex shrink-0 items-center gap-0.5">
        <AppDropdown align="end" :side-offset="4">
          <template #trigger>
            <AppButton variant="ghost" size="icon">
              <MoreHorizontal class="text-(--text-secondary)" />
            </AppButton>
          </template>

          <!-- Пока просто заглушка, ничего не скачивает -->
          <AppDropdownItem @select="console.log('Клик по скачиванию шаблона:', template.id)">
            <Download
              class="size-4 aspect-square shrink-0 text-[rgba(48,48,50,0.68)]"
              stroke-width="2"
            />
            <span class="text-sm font-medium text-[rgba(48,48,50,0.98)] leading-5 select-none">
              Скачать шаблон
            </span>
          </AppDropdownItem>

          <!-- Рабочее удаление файлов категории -->
          <AppDropdownItem
            :disabled="!filesCount"
            class="data-highlighted:bg-red-50!"
            @select="emit('clearAll')"
          >
            <Trash2 class="size-4 aspect-square shrink-0 text-[#B21A25]/68" stroke-width="2" />
            <span class="text-sm font-medium text-[#B21A25] leading-5 select-none">
              Удалить файлы
            </span>
          </AppDropdownItem>
        </AppDropdown>

        <AppButton variant="ghost" size="icon" @click="openFilePicker">
          <PlusCircle class="text-(--text-secondary)" stroke-width="2" />
        </AppButton>

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
    <div v-if="expanded" class="pb-3">
      <DatasetUploadZone v-if="!filesCount" @upload="emit('upload', $event)" />

      <DatasetFilesList v-else :files="files" @remove="emit('remove', $event)" />
    </div>
  </li>
</template>
