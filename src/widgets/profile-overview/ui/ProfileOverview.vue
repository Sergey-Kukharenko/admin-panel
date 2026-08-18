<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';

import { AppButton } from '@/shared/ui/app-button';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import MembersSection from './MembersSection.vue';
import OrganizationSection from './OrganizationSection.vue';
import SecuritySection from './SecuritySection.vue';
import TechnicalInfoSection from './TechnicalInfoSection.vue';

defineOptions({
  name: 'ProfileOverview',
});

const CONTACT_MANAGER_TOOLTIP_TEXT =
  'Нужны изменения?\n\nДля изменения данных организации, пользователей или других параметров аккаунта обратитесь к вашему менеджеру.';
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <div class="flex w-full flex-col gap-4">
      <OrganizationSection />
      <MembersSection />
      <SecuritySection />
    </div>

    <TechnicalInfoSection />

    <div class="flex w-full justify-end">
      <AppTooltip :icon="false" :text="CONTACT_MANAGER_TOOLTIP_TEXT">
        <AppButton variant="secondary" size="small">
          <ArrowUpRight class="size-4" />
          Связаться с менеджером
        </AppButton>
      </AppTooltip>
    </div>
  </div>
</template>
