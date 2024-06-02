<script setup lang="ts">
const { data: accounts } = useFetch('/api/accounts/getAllAccounts')
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <AccountCard  v-for="account in accounts" :account="account" />
        <NuxtLink class="btn btn-outline btn-primary" to="/accounts/new">New</NuxtLink>
    </div>
</template>