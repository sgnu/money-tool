<script setup lang="ts">
const institutionMap = new Map()
const { data: accounts } = await useFetch('/api/accounts/getAllAccounts')
await useFetch('/api/institutions/getAllInstitutions', {
    onResponse({ response }) {
        (response._data as any).forEach((institution: Institution) => {
            console.log(institution)
            institutionMap.set(institution.id, institution)
        })
    }
})

</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <AccountCard  v-for="account in accounts" :account="account as Account" :institution="institutionMap.get(account.institutionId) as Institution" />
        <NuxtLink class="btn btn-outline btn-primary" to="/accounts/new">New</NuxtLink>
    </div>
</template>