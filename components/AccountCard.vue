<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';

const props = defineProps<{
    account: Account,
    institution: Institution
  }>()

  const isLiability = computed(() => {
    return props.account.accountType === AccountTypes.CREDIT || props.account.accountType === AccountTypes.LIABILITY
  })

  const balance = computed(() => {
    return formatMoney(props.account.currentBalance)
  })
</script>

<template>
  <CardBase>
    <div class="card-body">
      <NuxtLink class="card-title" :to="`/accounts/${account.id}`">
        <h2>
          <img :src="institution.icon" class="w-8 h-8 inline">
          {{ account.name }} {{ account.accountNumber }}
        </h2>
      </NuxtLink>
      <p v-if="isLiability" class="text-right">$({{ balance }})</p>
      <p v-else class="text-right">${{ balance }}</p>
    </div>
  </CardBase>
</template>