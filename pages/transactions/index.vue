<script setup lang="ts">
const accountMap = ref(new Map())
let accountLoading = ref(true)
const { data: transactions, pending: transactionLoading } = useFetch('/api/transactions')

$fetch('/api/accounts', {
    onResponse({ response }) {
        (response._data as any[]).forEach((account: Account) => {
            accountMap.value.set(account.id, account)
        })
        setTimeout(() => {
            accountLoading.value = false
        }, 500)
    }
})
</script>

<!-- TODO: represent transactions like a table -->

<template>
    <div v-if="accountLoading || transactionLoading">
        <div class="skeleton w-full h-12"></div>
    </div>
    <div class="flex flex-col bg-base-200 shadow-xl py-6 gap-1 rounded-lg max-w-[960px] mx-auto" v-else>
        <template v-for="transaction in transactions">
            <TransactionListing class="px-8" :transaction="transaction as unknown as Transaction"
            :primary-account="accountMap.get(transaction.primaryAccount)"
            :secondary-account="accountMap.get(transaction.secondaryAccount)"></TransactionListing>
            <div class="divider my-0" />
        </template>
        <NuxtLink class="btn btn-outline btn-primary" to="/transactions/new">New</NuxtLink>
    </div>
</template>

<style scoped>
.divider:last-child {
    display: none;
}
</style>