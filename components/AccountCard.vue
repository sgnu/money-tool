<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';

const props = defineProps<{
    account: Account,
    institution: Institution
  }>()

  const isLiability = computed(() => {
    return props.account.accountType === AccountTypes.CREDIT || props.account.accountType === AccountTypes.LIABILITY
  })

</script>

<template>
  <div class="card w-64 bg-base-100 shadow-xl">
    <div class="card-body">
      <NuxtLink class="card-title" to="/">
        <h2>
          <img :src="institution.icon" class="w-8 h-8 inline">
          {{ account.name }} {{ account.accountNumber }}
        </h2>
      </NuxtLink>
      <p v-if="isLiability" class="text-right">$({{ account.currentBalance }})</p>
      <p v-else class="text-right">${{ account.currentBalance }}</p>
    </div>
  </div>
</template>