<script setup lang="ts">
import { ProfileOverview } from '@/widgets/profile-overview';

defineOptions({
  name: 'ProfilePage',
});
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <ProfileOverview />
  </div>
</template>
