<script setup lang="ts">
import BalanceIcon from '@/entities/dataset/assets/icons/balance.svg';
import Bets from '@/entities/dataset/assets/icons/bets.svg';
import PaymentsIcon from '@/entities/dataset/assets/icons/payments.svg';
import Users from '@/entities/dataset/assets/icons/users.svg';
import VipUsers from '@/entities/dataset/assets/icons/vip-users.svg';
import type { DatasetIcon } from '@/entities/dataset/model/types';

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
  <!-- Декоративная иконка — рядом всегда есть видимое название типа данных текстом,
       поэтому alt пустой, а не технический идентификатор (icon), чтобы скринридер
       не дублировал объявление -->
  <img :src="icons[props.icon]" alt="" class="size-4 shrink-0" />
</template>
