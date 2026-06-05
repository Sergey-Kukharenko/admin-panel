<script setup lang="ts">
import AdminHeader from './AdminHeader.vue';
import AdminSidebar from './AdminSidebar.vue';
</script>

<template>
  <div class="flex h-screen bg-(--background)">
    <AdminSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminHeader />

      <main class="flex-1 overflow-auto p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
