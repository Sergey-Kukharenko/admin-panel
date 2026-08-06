<script setup lang="ts">
import AdminHeader from './AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';
</script>

<template>
  <div class="flex min-h-screen w-full">
    <AdminSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminHeader class="shrink-0" />

      <main class="flex flex-1 flex-col gap-6 p-8 pb-12">
        <RouterView />
      </main>
    </div>
  </div>
</template>
