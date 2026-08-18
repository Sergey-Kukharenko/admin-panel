<script setup lang="ts">
import { MOCK_ORGANIZATION } from '@/entities/organization';

import { ProfileInfoRow } from './profile-info-row';

defineOptions({
  name: 'OrganizationSection',
});
</script>

<template>
  <section
    class="flex w-full flex-col gap-2 rounded-(--radius-xl) pt-4 pb-2"
    style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
  >
    <p class="px-4 text-base font-medium text-[#181818]">Организация</p>

    <div
      class="mx-2 flex flex-col gap-4 rounded-(--radius-lg) border border-(--border-default) bg-white p-4"
    >
      <ProfileInfoRow label="Наименование организации" :value="MOCK_ORGANIZATION.name" />

      <div class="h-px w-full bg-(--border-default)" />

      <ProfileInfoRow label="Проект" :value="MOCK_ORGANIZATION.projectName" />

      <div class="h-px w-full bg-(--border-default)" />

      <ProfileInfoRow label="Дата создания" :value="MOCK_ORGANIZATION.createdAt" :copyable="false" />
    </div>
  </section>
</template>
