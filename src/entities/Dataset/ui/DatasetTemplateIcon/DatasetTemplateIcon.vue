<script setup lang="ts">
import BalanceIcon from '@/entities/Dataset/assets/icons/balance.svg';
import Bets from '@/entities/Dataset/assets/icons/bets.svg';
import PaymentsIcon from '@/entities/Dataset/assets/icons/payments.svg';
import Users from '@/entities/Dataset/assets/icons/users.svg';
import VipUsers from '@/entities/Dataset/assets/icons/vip-users.svg';
import type { DatasetIcon } from '@/entities/Dataset/model/types';

defineOptions({
  name: 'DatasetTemplateIcon',
});

const props = defineProps<{
  icon: DatasetIcon;
}>();

const icons: Record<DatasetIcon, string> = {
  users: Users,
  vip: VipUsers,
  bets: Bets,
  balance: BalanceIcon,
  payments: PaymentsIcon,
};
</script>

<template>
  <img :src="icons[props.icon]" :alt="icon" class="size-4 shrink-0" />
</template>
