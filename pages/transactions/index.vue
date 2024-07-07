<script setup lang="ts">
const accountMap = ref(new Map())
const categoryMap = ref(new Map<number, Category>())
let accountLoading = ref(true)
let categoryLoading = ref(true)
const { data: transactions, pending: transactionLoading } = useFetch('/api/transactions')

onMounted(async () => {
    await nextTick(async () => {
        await $fetch('/api/transactions/categories', {
            onResponse({ response }) {
                const categories = response._data as Category[]
                categories.forEach(category => {
                    categoryMap.value.set(category.id, category)
                })
                setTimeout(() => {
                    categoryLoading.value = false
                }, useRuntimeConfig().minimumLoading)
            }
        })

        await $fetch('/api/accounts', {
            onResponse({ response }) {
                (response._data as any[]).forEach((account: Account) => {
                    accountMap.value.set(account.id, account)
                })
                setTimeout(() => {
                    accountLoading.value = false
                }, useRuntimeConfig().minimumLoading)
            }
        })
    })
})
</script>

<template>
    <div v-if="accountLoading || transactionLoading || categoryLoading">
        <div class="skeleton w-full h-12"></div>
    </div>
    <div class="flex flex-col bg-base-200 shadow-xl py-6 gap-1 rounded-lg max-w-[960px] mx-auto" v-else>
        <template v-for="transaction in transactions">
            <TransactionListing class="px-8" :transaction="transaction as unknown as Transaction"
            :primary-account="accountMap.get(transaction.primaryAccount)"
            :secondary-account="accountMap.get(transaction.secondaryAccount)"
            :category="categoryMap.get(transaction.category as number)"></TransactionListing>
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