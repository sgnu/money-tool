<script setup lang="ts">
const props = defineProps<{
    account: Account
  }>()

</script>

<template>
  <div class="card w-64 bg-base-100 shadow-xl">
    <div class="card-body">
      <NuxtLink to="TODO: goto account info">
        <h2 class="card-title">{{ account.name }}</h2>
      </NuxtLink>
    </div>
  </div>
</template>