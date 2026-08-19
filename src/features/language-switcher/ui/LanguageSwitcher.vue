<script setup lang="ts">
import { Check, Globe } from 'lucide-vue-next';
import { ref } from 'vue';

import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'LanguageSwitcher',
});

interface LanguageOption {
  code: 'ru' | 'en';
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const selectedCode = ref<LanguageOption['code']>('ru');
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-(--radius-sm) hover:bg-(--muted)"
        aria-label="Выбрать язык"
      >
        <Globe class="size-4 text-(--icon-tertiary)" />
      </button>
    </template>

    <AppDropdownItem
      v-for="language in LANGUAGES"
      :key="language.code"
      class="w-36 justify-between"
      @select="selectedCode = language.code"
    >
      <span class="flex items-center gap-2 text-body-sm font-medium text-(--text-primary)">
        <span class="text-xs font-medium text-(--text-tertiary) uppercase">{{ language.code }}</span>
        {{ language.label }}
      </span>

      <Check v-if="selectedCode === language.code" class="size-4 text-(--text-secondary)" />
    </AppDropdownItem>
  </AppDropdown>
</template>
