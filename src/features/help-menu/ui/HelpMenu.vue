<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { FEATURE_HELP_LINKS } from '@/shared/config/env';
import { AppButton } from '@/shared/ui/app-button';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppIconButton } from '@/shared/ui/app-icon-button';

defineOptions({
  name: 'HelpMenu',
});

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Layout of the mockup (Figma 1418:195022): ListBox regular 12/12/8/12 with title + description,
       then the buttons block 0/12/8/12 with gap 8; the dropdown itself has only 4px bottom padding -->
  <AppDropdown align="end" :side-offset="8" content-class="w-60 gap-1 pb-1">
    <template #trigger>
      <AppIconButton :aria-label="t('layout.helpMenu.ariaLabel')">
        <AppIcon name="information-2-line" class="size-4.5 text-(--icon-secondary)" />
      </AppIconButton>
    </template>

    <div class="flex flex-col gap-1 px-3 pt-3 pb-2">
      <h4 class="text-body-sm font-medium text-(--text-primary)">
        {{ t('layout.helpMenu.title') }}
      </h4>
      <p class="text-body-xs whitespace-pre-line text-(--text-secondary)">
        {{ t('layout.helpMenu.description') }}
      </p>
    </div>

    <!-- TODO: the buttons have no targets yet: they stay behind FEATURE_HELP_LINKS until the docs
         link and the manager contact are defined (WT-323). Menu items, so the arrow keys reach them -->
    <div v-if="FEATURE_HELP_LINKS" class="flex flex-col gap-2 px-3 pb-2">
      <AppDropdownItem as-child>
        <AppButton variant="secondary" size="small" class="w-full">
          {{ t('layout.helpMenu.docs') }}
        </AppButton>
      </AppDropdownItem>
      <AppDropdownItem as-child>
        <AppButton variant="secondary" size="small" class="w-full">
          {{ t('layout.helpMenu.contactManager') }}
        </AppButton>
      </AppDropdownItem>
    </div>
  </AppDropdown>
</template>
