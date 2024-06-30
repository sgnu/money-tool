<script setup lang="ts">
const institutionMap = ref(new Map())
let institutionLoading = ref(true)
const { data: accounts, pending: accountLoading } = useFetch('/api/accounts', {
})

$fetch('/api/institutions', {
    onResponse({ response }) {
        (response._data as any[]).forEach((institution: Institution) => {
            institutionMap.value.set(institution.id, institution)
        })
        setTimeout(() => {
            institutionLoading.value = false
        }, useRuntimeConfig().minimumLoading)
    }
})

</script>

<template>
    <div v-if="accountLoading || institutionLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <SkeletonCard />
    </div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <AccountCard  v-for="account in accounts" :account="account as Account" :institution="institutionMap.get(account.institutionId) as Institution" />
        <NuxtLink class="btn btn-outline btn-primary" to="/accounts/new">New</NuxtLink>
    </div>
</template>