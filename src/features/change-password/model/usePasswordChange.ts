import { computed, onUnmounted, ref } from 'vue';
import { toast } from 'vue-sonner';

const COOLDOWN_SECONDS = 15 * 60;

export function usePasswordChange() {
  const isModalOpen = ref(false);
  const cooldownSecondsLeft = ref(0);
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const isOnCooldown = computed(() => cooldownSecondsLeft.value > 0);

  const cooldownLabel = computed(() => {
    const minutes = Math.floor(cooldownSecondsLeft.value / 60);
    const seconds = cooldownSecondsLeft.value % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  function stopCooldownTimer() {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startCooldown() {
    cooldownSecondsLeft.value = COOLDOWN_SECONDS;
    stopCooldownTimer();

    intervalId = setInterval(() => {
      if (cooldownSecondsLeft.value <= 1) {
        cooldownSecondsLeft.value = 0;
        stopCooldownTimer();

        return;
      }

      cooldownSecondsLeft.value -= 1;
    }, 1000);
  }

  function openModal() {
    if (isOnCooldown.value) return;

    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  function confirmSend() {
    isModalOpen.value = false;
    toast.success('Письмо направлено! Проверьте почту.');
    startCooldown();
  }

  onUnmounted(stopCooldownTimer);

  return {
    isModalOpen,
    isOnCooldown,
    cooldownLabel,
    openModal,
    closeModal,
    confirmSend,
  };
}
