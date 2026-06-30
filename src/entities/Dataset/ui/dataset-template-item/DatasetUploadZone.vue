<script setup lang="ts">
import { ref } from 'vue';

import { AppButton } from '@/shared/ui/app-button';

export interface DatasetUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

defineOptions({
  name: 'DatasetUploadZone',
});

const props = withDefaults(defineProps<DatasetUploadZoneProps>(), {
  accept: '.csv',
  multiple: true,
  disabled: false,
});

const emit = defineEmits<{
  upload: [File[]];
}>();

const inputRef = ref<HTMLInputElement>();
const isDragOver = ref(false); // Состояние для визуальной подсветки при перетаскивании

const handleSelect = () => {
  if (!inputRef.value || props.disabled) {
    return;
  }

  inputRef.value.click();
};

const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  emit('upload', Array.from(input.files));

  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (props.disabled || !event.dataTransfer?.files.length) {
    return;
  }

  emit('upload', Array.from(event.dataTransfer.files));
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (props.disabled) return;
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center rounded-(--radius-md) border border-dashed text-center py-10 px-6 transition-colors duration-150 ease-in-out',
      // Динамические стили в зависимости от состояний
      isDragOver ? 'border-(--primary) bg-(--muted)' : 'border-(--border) bg-(--background)',
      disabled ? 'opacity-50 pointer-events-none' : '',
    ]"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
  >
    <p class="text-body-sm text-(--text-secondary) mb-3 select-none">Нет добавленных файлов</p>

    <AppButton variant="outline" size="medium" :disabled="disabled" @click="handleSelect">
      Выбрать файлы
    </AppButton>

    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleChange"
    />
  </div>
</template>
