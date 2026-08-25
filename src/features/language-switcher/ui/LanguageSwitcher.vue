<script setup lang="ts">
import { Check, Globe } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { AppLocale } from '@/shared/i18n';
import { setAppLocale } from '@/shared/i18n';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'LanguageSwitcher',
});

interface LanguageOption {
  code: AppLocale;
  label: string;
}

// Названия языков не переводятся — это имена самих языков, а не контент интерфейса
const LANGUAGES: LanguageOption[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const { locale, t } = useI18n({ useScope: 'global' });
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button
        type="button"
        class="flex size-8 items-center justify-center rounded-(--radius-sm) hover:bg-(--muted)"
        :aria-label="t('layout.languageSwitcher.ariaLabel')"
      >
        <Globe class="size-4 text-(--icon-tertiary)" />
      </button>
    </template>

    <AppDropdownItem
      v-for="language in LANGUAGES"
      :key="language.code"
      class="w-36 justify-between"
      @select="setAppLocale(language.code)"
    >
      <span class="flex items-center gap-2 text-body-sm font-medium text-(--text-primary)">
        <span class="text-xs font-medium text-(--text-tertiary) uppercase">{{ language.code }}</span>
        {{ language.label }}
      </span>

      <Check v-if="locale === language.code" class="size-4 text-(--text-secondary)" />
    </AppDropdownItem>
  </AppDropdown>
</template>
