<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userManager } from '@/shared/api/auth';
import { useUserStore } from '@/entities/user';
import { Loader2 } from 'lucide-vue-next';

defineOptions({
  name: 'AuthCallbackPage',
});

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // 1. Опрашиваем менеджер, чтобы он забрал code из URL и обменял его на токены
    const loadedUser = await userManager.signinRedirectCallback();

    // 2. Записываем полученного пользователя в наш глобальный стор
    userStore.user.value = loadedUser;

    // 3. Успешно авторизовали, возвращаем на главную страницу приложения
    router.push('/');
  } catch (error) {
    console.error('Ошибка при обработке колбэка авторизации:', error);
    // В случае сбоя возвращаем на главную, где Guard снова триггернет логин
    router.push('/');
  }
});
</script>

<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-[var(--background)] select-none"
  >
    <div class="flex flex-col items-center gap-2">
      <!-- Наш красивый лоадер из lucide-vue-next -->
      <Loader2 class="w-8 h-8 animate-spin text-[var(--primary)]" />
      <span class="text-sm text-[var(--text-secondary)] font-sans font-medium">
        Авторизация в системе...
      </span>
    </div>
  </div>
</template>
