<script setup lang="ts">
const props = defineProps<{
    account: Account,
    institution: Institution
  }>()

</script>

<template>
  <div class="card w-64 bg-base-100 shadow-xl">
    <div class="card-body">
      <NuxtLink class="card-title" to="TODO: goto account info">
        <h2>
          <img :src="institution.icon">
          {{ account.name }} ...{{ account.accountNumber }}
        </h2>
      </NuxtLink>
      <p class="text-right">${{ account.currentBalance }}</p>
    </div>
  </div>
</template>