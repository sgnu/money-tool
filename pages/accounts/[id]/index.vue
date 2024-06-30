<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';
import { TransactionTypes } from '~/types/TransactionTypes';

const route = useRoute()
const accountMap = ref(new Map())
let accountLoading = ref(true)
const { data: accountData } = await useFetch(`/api/accounts/${route.params.id}`)
const { data: transactionData, pending: transactionLoading } = await useFetch(`/api/accounts/${route.params.id}/transactions`)

$fetch('/api/accounts', {
    onResponse({ response }) {
        (response._data as any[]).forEach((account: Account) => {
            accountMap.value.set(account.id, account)
        })
        setTimeout(() => {
            accountLoading.value = false
        }, useRuntimeConfig().minimumLoading)
    }
})

const account: Account = accountData.value as Account
const transactions: Transaction[] = transactionData.value as unknown as Transaction[]

const defaultTransactions = ref<TransactionTypes[]>([])

if (account.accountType === AccountTypes.CHECKINGS) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INCOME, TransactionTypes.INTEREST, TransactionTypes.PAYMENT, TransactionTypes.PURCHASE, TransactionTypes.TRANSFER]
} else if (account.accountType === AccountTypes.SAVINGS) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INTEREST, TransactionTypes.TRANSFER]
} else if (account.accountType === AccountTypes.CREDIT) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INTEREST, TransactionTypes.PURCHASE, TransactionTypes.PAYMENT]
}

const isLiability = computed(() => {
    return account.accountType === AccountTypes.CREDIT || account.accountType === AccountTypes.LIABILITY
})

const balance = computed(() => {
    return formatMoney(account.currentBalance)
})

const deleteAccount = () => {
    window.alert('This will delete the account.')
}

const createTransaction = (type?: TransactionTypes) => {
    const queries = {
        primaryAccount: <number | null> null,
        secondaryAccount: <number | null> null,
        type: <TransactionTypes | null> null
    }
    if (!type) {
        queries.primaryAccount = account.id
    } else {
        queries.type = type
    }
    
    //TODO: finish handlings for types
    if (type === TransactionTypes.ADJUSTMENT) {
        queries.primaryAccount = account.id
    } else if (type === TransactionTypes.INCOME) {
        queries.primaryAccount = account.id
    } else if (type === TransactionTypes.INTEREST) {
        queries.primaryAccount = account.id
    } else if (type === TransactionTypes.PAYMENT) {
        if (account.accountType === AccountTypes.CREDIT || account.accountType === AccountTypes.LIABILITY) {
            queries.secondaryAccount = account.id
        } else {
            queries.primaryAccount = account.id
        }
    }
    else if (type === TransactionTypes.TRANSFER) {
        queries.primaryAccount = account.id
    }

    navigateTo({
        path: '/transactions/new',
        query: queries
    })
}
</script>

<template>
    <div v-if="accountLoading || transactionLoading">
        loading...
    </div>
    <div v-else>
        <div class="flex flex-wrap items-baseline mb-2">
            <h1 class="text-5xl basis-auto">{{ account.name }} ...{{ account.accountNumber }}</h1>
            <p class="justify-self-end text-2xl italic">
                <span v-if="isLiability">$({{ balance }})</span>
                <span v-else>${{ balance }}</span>
            </p>
            <FlexBreak />
            <p class="italic text-neutral-400">{{ account.accountType }}</p>
        </div>
        <div class="flex justify-end gap-x-2 gap-y-1 flex-wrap">
            <div class="dropdown justify-self-start xl:hidden">
                <div tabindex="0" class="btn btn-primary text-lg" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New
                </div>
                <ul tabindex="0" class="menu dropdown-content shadow join join-vertical w-52 m-0">
                    <button @click="createTransaction()" class="btn btn-sm btn-primary justify-start join-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Transaction
                    </button>
                    <button v-for="transactionType in defaultTransactions" @click="createTransaction(transactionType)"
                        class="btn btn-sm btn-primary join-item justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ transactionType }}
                    </button>
                </ul>
            </div>
            <NuxtLink class="btn btn-outline text-lg" :to="`/accounts/${route.params.id}/edit`">Edit</NuxtLink>
            <button class="btn btn-outline btn-error w-fit text-lg" @click="deleteAccount">Delete</button>
            <FlexBreak />
            <!-- TODO: change to drop down when small -->
            <div class="join hidden xl:block xl:join-horizontal">
                <button @click="createTransaction()" class="btn btn-outline btn-sm btn-primary join-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Transaction
                </button>
                <button v-for="transactionType in defaultTransactions" @click="createTransaction(transactionType)"
                    class="btn btn-outline btn-sm btn-primary join-item justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {{ transactionType }}
                </button>
            </div>
        </div>
        <div class="divider" />
        <div class="flex flex-col bg-neutral shadow-xl py-2 rounded-lg" v-if="transactions.length > 0">
            <template v-for="transaction in transactions">
                <TransactionListing class="px-4" :transaction="transaction"
                    :primary-account="accountMap.get(transaction.primaryAccount)"
                    :secondary-account="accountMap.get(transaction.secondaryAccount)" />
                <div class="divider my-0" />
            </template>
        </div>
        <div v-else class="italic text-center">
            No transactions found!
        </div>
    </div>
</template>

<style scoped>
.divider:last-child {
    display: none;
}
</style>