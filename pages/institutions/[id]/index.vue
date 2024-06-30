<script setup lang="ts">
const route = useRoute()
const { data: institutionData, pending: institutionLoading } = await useFetch(`/api/institutions/${route.params.id}`)
const { data: accountData, pending: accountLoading } = await useFetch(`/api/institutions/${route.params.id}/accounts`)

const institution: Institution = institutionData.value as Institution
const accounts: Account[] = accountData.value as Account[]
</script>

<template>
    <div v-if="accountLoading || institutionLoading">
        <SkeletonCard />
        <SkeletonCard />
    </div>

    <div v-else>
        <span><img :src="institution.icon" /><h1>{{ institution.name }}</h1></span>
        <!-- <p></p> -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
            <AccountCard v-for="account in accounts" :account="account" :institution="institution" />
        </div>
    </div>
</template>