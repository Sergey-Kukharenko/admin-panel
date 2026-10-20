<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { AppLocale } from '@/shared/i18n';
import { setAppLocale } from '@/shared/i18n';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppIconButton } from '@/shared/ui/app-icon-button';

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
  <AppDropdown align="end" :side-offset="8" content-class="gap-1 p-1">
    <template #trigger>
      <AppIconButton :aria-label="t('layout.languageSwitcher.ariaLabel')">
        <AppIcon name="global-line" class="size-4.5 text-(--icon-secondary)" />
      </AppIconButton>
    </template>

    <AppDropdownItem
      v-for="language in LANGUAGES"
      :key="language.code"
      class="w-37 justify-between"
      @select="setAppLocale(language.code)"
    >
      <span class="flex items-center gap-3 text-body-sm font-medium text-(--text-primary)">
        <!-- ru/en icons from the icon set (Figma 1418:195848); icon name = locale code -->
        <AppIcon :name="language.code" class="text-(--icon-primary)" />
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
