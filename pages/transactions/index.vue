<script setup lang="ts">
const accountMap = ref(new Map())
let accountLoading = ref(true)
const { data: transactions, pending: transactionLoading } = useFetch('/api/transactions/getAllTransactions')

$fetch('/api/accounts/getAllAccounts', {
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
    <div class="flex flex-col" v-else>
        <TransactionCard v-for="transaction in transactions" :transaction="transaction as unknown as Transaction" :primary-account="accountMap.get(transaction.primaryAccount)" :secondary-account="accountMap.get(transaction.secondaryAccount)"/>
        <NuxtLink class="btn btn-outline btn-primary" to="/transactions/new">New</NuxtLink>
    </div>
</template>