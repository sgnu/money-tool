<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';

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


const balances = computed(() => {
    let assetSum = 0;
    let liabilitySum = 0;

    (accounts.value as Account[]).forEach((account: Account) => {
        if (account.accountType === AccountTypes.CREDIT || account.accountType === AccountTypes.LIABILITY) {
            liabilitySum += account.currentBalance
        } else {
            assetSum += account.currentBalance
        }
    })

    return {
        assets: formatMoney(assetSum),
        liabilities: formatMoney(liabilitySum),
        total: formatMoney(assetSum - liabilitySum)
    }
})
</script>

<template>
    <div v-if="accountLoading || institutionLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 place-items-center">
        <SkeletonCard />
    </div>
    <div v-else>
        <div class="flex justify-start xl:justify-end mb-4">
            <div class="stats stats-vertical xl:stats-horizontal">
                <div class="stat">
                    <div class="stat-title">Assets</div>
                    <div class="stat-value">${{ balances.assets }}</div>
                </div>
                <div class="stat" v-if="parseFloat(balances.liabilities) > 0">
                    <div class="stat-title">Liabilities</div>
                    <div class="stat-value">$({{ balances.liabilities }})</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Total Balance</div>
                    <div class="stat-value">${{ balances.total }}</div>
                </div>
            </div>
        </div>
        <div class="flex justify-end">
            <NuxtLink class="btn btn-outline btn-primary" to="/accounts/new">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Account
            </NuxtLink>
        </div>
        <div class="divider"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
            <AccountCard  v-for="account in accounts" :account="account as Account" :institution="institutionMap.get(account.institutionId) as Institution" />
        </div>
    </div>
</template>