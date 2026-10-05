<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { AppLocale } from '@/shared/i18n';
import { setAppLocale } from '@/shared/i18n';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';

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
        <AppIcon name="global-line" class="size-4.5 text-(--icon-tertiary)" />
      </button>
    </template>

    <AppDropdownItem
      v-for="language in LANGUAGES"
      :key="language.code"
      class="w-36 justify-between"
      @select="setAppLocale(language.code)"
    >
      <span class="flex items-center gap-3 text-body-sm font-medium text-(--text-primary)">
        <!-- Иконки ru/en из набора (Figma 1418:195848); имя иконки = код локали -->
        <AppIcon :name="language.code" class="text-(--text-tertiary)" />
        {{ language.label }}
      </span>

      <AppIcon
        v-if="locale === language.code"
        name="check-line"
        class="size-4 text-(--text-secondary)"
      />
    </AppDropdownItem>
  </AppDropdown>
</template>
