import { onMounted, ref, watch } from 'vue';

import type { DatasetFile } from '@/entities/dataset/model/types';

export type SavedFilesState = Record<string, DatasetFile[]>;

// Экспортируем константу максимального размера (500 МБ в байтах) для использования в UI компонентах
// export const MAX_FILE_SIZE = 500 * 1024 * 1024;
export const MAX_FILE_SIZE = 500;

export function useDatasetFiles() {
  const filesMap = ref<SavedFilesState>({});

  onMounted(() => {
    const saved = localStorage.getItem('dataset_uploaded_files');
    if (saved) {
      try {
        filesMap.value = JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка чтения файлов из хранилища', e);
      }
    }
  });

  watch(
    filesMap,
    (newMap) => {
      localStorage.setItem('dataset_uploaded_files', JSON.stringify(newMap));
    },
    { deep: true },
  );

  // Добавление файлов с гарантированным триггером реактивности Vue
  const addFiles = (templateId: string, newFiles: File[]) => {
    const metaFiles: DatasetFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size, // Пишем оригинальный размер файла в байтах
      uploadedAt: new Date().toISOString(),
    }));

    const currentCategoryFiles = filesMap.value[templateId] ? [...filesMap.value[templateId]] : [];
    currentCategoryFiles.push(...metaFiles);

    filesMap.value = {
      ...filesMap.value,
      [templateId]: currentCategoryFiles,
    };
  };

  // Удаление файлов с гарантированным триггером реактивности
  const removeFile = (fileId: string) => {
    const updatedMap: SavedFilesState = {};

    for (const templateId in filesMap.value) {
      const currentFiles = filesMap.value[templateId];
      if (!currentFiles) continue;

      const filtered = currentFiles.filter((file) => file.id !== fileId);

      // Сохраняем в новый объект только если в категории еще остались файлы
      if (filtered.length > 0) {
        updatedMap[templateId] = filtered;
      }
    }

    // Перезаписываем объект стейта целиком
    filesMap.value = updatedMap;
  };

  // Удаление всех файлов конкретного шаблона
  const clearTemplateFiles = (templateId: string) => {
    if (filesMap.value[templateId]) {
      // Клонируем стейт без нужного ключа для чистого триггера реактивности Vue
      const updatedMap = { ...filesMap.value };
      delete updatedMap[templateId];

      filesMap.value = updatedMap;
    }
  };

  return {
    filesMap,
    addFiles,
    removeFile,
    clearTemplateFiles,
  };
}
