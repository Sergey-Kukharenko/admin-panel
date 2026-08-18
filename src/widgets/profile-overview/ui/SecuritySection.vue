<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';

import { MOCK_ORGANIZATION_MEMBERS } from '@/entities/organization';
import { ChangePasswordModal, usePasswordChange } from '@/features/change-password';
import { AppButton } from '@/shared/ui/app-button';

import { ProfileInfoRow } from './profile-info-row';

defineOptions({
  name: 'SecuritySection',
});

const MASKED_PASSWORD = '•'.repeat(10);
const memberEmail = MOCK_ORGANIZATION_MEMBERS[0]?.email ?? '';

const { isModalOpen, isOnCooldown, cooldownLabel, openModal, closeModal, confirmSend } =
  usePasswordChange();
</script>

<template>
  <section
    class="flex w-full flex-col gap-2 rounded-(--radius-xl) pt-4 pb-2"
    style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
  >
    <p class="px-4 text-base font-medium text-[#181818]">Безопасность</p>

    <div class="mx-2 flex flex-col gap-4 rounded-(--radius-lg) border border-(--border-default) bg-white p-4">
      <p v-if="isOnCooldown" class="text-xs text-(--text-secondary)">
        Повторный запрос на смену пароля будет доступен через {{ cooldownLabel }}
      </p>

      <ProfileInfoRow label="Пароль" :value="MASKED_PASSWORD" label-width-class="w-35" :copyable="false">
        <template #action>
          <AppButton
            variant="outline"
            size="icon"
            :disabled="isOnCooldown"
            aria-label="Изменить пароль"
            @click="openModal"
          >
            <Pencil class="size-4" />
          </AppButton>
        </template>
      </ProfileInfoRow>
    </div>

    <ChangePasswordModal
      :open="isModalOpen"
      :email="memberEmail"
      @close="closeModal"
      @confirm="confirmSend"
    />
  </section>
</template>
