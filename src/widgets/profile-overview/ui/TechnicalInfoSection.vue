<script setup lang="ts">
import { MOCK_ORGANIZATION_TECH_INFO } from '@/entities/organization';

import { ProfileInfoRow } from './profile-info-row';

defineOptions({
  name: 'TechnicalInfoSection',
});
</script>

<template>
  <section
    class="flex w-full flex-col gap-2 rounded-(--radius-xl) pt-4 pb-2"
    style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
  >
    <p class="px-4 text-base font-medium text-[#181818]">Техническая информация</p>

    <div class="mx-2 flex flex-col gap-4 rounded-(--radius-lg) border border-(--border-default) bg-white p-4">
      <ProfileInfoRow
        label="project_slug"
        :value="MOCK_ORGANIZATION_TECH_INFO.projectSlug"
        label-width-class="w-35"
      />

      <div class="h-px w-full bg-(--border-default)" />

      <ProfileInfoRow
        label="organization_id"
        :value="MOCK_ORGANIZATION_TECH_INFO.organizationId"
        label-width-class="w-35"
      />

      <div class="h-px w-full bg-(--border-default)" />

      <ProfileInfoRow
        label="workspace_id"
        :value="MOCK_ORGANIZATION_TECH_INFO.workspaceId"
        label-width-class="w-35"
      />
    </div>
  </section>
</template>
