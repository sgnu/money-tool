<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';
import { TransactionTypes } from '~/types/TransactionTypes';

const route = useRoute()

const accountMap = ref(new Map())
const categoryMap = ref(new Map<number, Category>())
const currentDate = new Date()
const previousDate = getPreviousMonth(currentDate)
let accountLoading = ref(true)
let categoryLoading = ref(true)

const { data: accountData } = await useFetch(`/api/accounts/${route.params.id}`)
const { data: transactionData, pending: transactionLoading } = await useFetch(`/api/accounts/${route.params.id}/transactions`)
const { data: institutionData, pending: institutionLoading } = await useFetch(`/api/institutions/${accountData.value?.institutionId}`)
const { data: currentMonthData } = await useFetch(`/api/accounts/${route.params.id}/transactions/${currentDate.getUTCFullYear()}/${currentDate.getUTCMonth() + 1}`)
const { data: previousMonthData } = await useFetch(`/api/accounts/${route.params.id}/transactions/${previousDate.getUTCFullYear()}/${previousDate.getUTCMonth() + 1}`)

onMounted(async () => {
    await nextTick(async () => {
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

        $fetch('/api/transactions/categories', {
            onResponse({ response }) {
                (response._data as Category[]).forEach(category => {
                    categoryMap.value.set(category.id, category)
                })
                setTimeout(() => {
                    categoryLoading.value = false
                }, useRuntimeConfig().minimumLoading)
            }
        })
    })
})

const institution: Institution = institutionData.value as Institution
const account: Account = accountData.value as Account
const transactions: Transaction[] = transactionData.value as unknown as Transaction[]
const currentMonth: Transaction[] = currentMonthData.value as unknown as Transaction[]
const previousMonth: Transaction[] = previousMonthData.value as unknown as Transaction[]

const defaultTransactions = ref<TransactionTypes[]>([])

if (account.accountType === AccountTypes.CHECKINGS) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INCOME, TransactionTypes.INTEREST, TransactionTypes.PAYMENT, TransactionTypes.PURCHASE, TransactionTypes.TRANSFER]
} else if (account.accountType === AccountTypes.SAVINGS) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INTEREST, TransactionTypes.TRANSFER]
} else if (account.accountType === AccountTypes.CREDIT) {
    defaultTransactions.value = [TransactionTypes.ADJUSTMENT, TransactionTypes.INTEREST, TransactionTypes.PURCHASE, TransactionTypes.PAYMENT]
}

const balanceString = computed(() => {
    return isLiability() ? `(${formatMoney(account.currentBalance)})` : formatMoney(account.currentBalance)
})

function cashFlow(transactionArray: Transaction[]) {
    // TODO: maybe change to return an object,
    // negative flow is displayed as $-X currently
    if (transactionArray) {
        let sum = 0
        transactionArray.forEach(transaction => {
            if (transaction.type === TransactionTypes.INCOME) {
                sum += transaction.amount
            } else if (transaction.type === TransactionTypes.INTEREST) {
                sum += transaction.amount
            } else if (transaction.type === TransactionTypes.PAYMENT) {
                sum -= transaction.amount
            } else if (transaction.type === TransactionTypes.PURCHASE) {
                if (isLiability()) {
                    sum += transaction.amount
                } else {
                    sum -= transaction.amount
                }
            } else if (transaction.type === TransactionTypes.TRANSFER) {
                if (transaction.primaryAccount === account.id) {
                    sum -= transaction.amount
                } else if (transaction.secondaryAccount === account.id) {
                    sum += transaction.amount
                }
            }
        })

        return formatMoney(sum)
    } else {
        return null
    }
}

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
    } else if (type === TransactionTypes.PURCHASE) {
        queries.primaryAccount = account.id
    } else if (type === TransactionTypes.TRANSFER) {
        queries.primaryAccount = account.id
    }

    navigateTo({
        path: '/transactions/new',
        query: queries
    })
}

function isLiability() {
    return account.accountType === AccountTypes.CREDIT || account.accountType === AccountTypes.LIABILITY
}
</script>

<template>
    <div v-if="accountLoading || transactionLoading || institutionLoading || categoryLoading">
        loading...
    </div>
    <div v-else>
        <div class="flex flex-wrap items-baseline mb-2">
            <h1 class="text-5xl basis-auto flex items-baseline gap-4">
                <img :src="institution.icon" class="inline w-8 h-8"/>
                <span>{{ account.name }} ...{{ account.accountNumber }}</span>
            </h1>
            <FlexBreak />
            <p class="italic text-neutral-400">{{ account.accountType }}</p>
        </div>
        <div class="flex gap-x-2 gap-y-1 flex-wrap w-full justify-normal">

            <NuxtLink class="btn btn-primary text-lg font-normal" :to="`/accounts/${route.params.id}/edit`">Edit</NuxtLink>
            <button class="btn btn-ghost w-fit text-lg font-light" @click="deleteAccount">Delete</button>
            <FlexBreak class="sm:hidden" />

            <div class="dropdown xl:hidden">
                <div tabindex="0" class="btn btn-neutral text-lg font-normal" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New
                </div>
                <ul tabindex="0" class="menu dropdown-content shadow join join-vertical w-52 mt-2 p-0 z-[999]">
                    <button @click="createTransaction()" class="btn justify-start font-normal join-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Transaction
                    </button>
                    <button v-for="transactionType in defaultTransactions" @click="createTransaction(transactionType)"
                        class="btn btn-neutral join-item font-normal justify-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {{ transactionType }}
                    </button>
                </ul>
            </div>

            <FlexBreak />
            <div class="join hidden xl:block xl:join-horizontal">
                <button @click="createTransaction()" class="btn btn-outline btn-sm btn-neutral font-normal join-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Transaction
                </button>
                <button v-for="transactionType in defaultTransactions" @click="createTransaction(transactionType)"
                    class="btn btn-outline btn-sm btn-neutral join-item font-normal justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {{ transactionType }}
                </button>
            </div>

            <FlexBreak />
            <div class="flex w-full justify-start xl:justify-end">
                <div class="stats stats-vertical xl:stats-horizontal">
                    <div class="stat" v-if="previousMonth.length > 0">
                        <div class="stat-title">Last Month's Cash Flow</div>
                        <div class="stat-value">${{ cashFlow(previousMonth) }}</div>
                    </div>
                    <div class="stat" v-if="currentMonth.length > 0">
                        <div class="stat-title">This Month's Cash Flow</div>
                        <div class="stat-value">${{ cashFlow(currentMonth) }}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">Balance</div>
                        <div class="stat-value">${{ balanceString }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="divider" />

        <div class="flex flex-col gap-1 bg-base-200 shadow-xl py-6 rounded-lg max-w-[960px] mx-auto" v-if="transactions.length > 0">
            <template v-for="transaction in transactions">
                <TransactionListing class="px-8" :transaction="transaction"
                    :primary-account="accountMap.get(transaction.primaryAccount)"
                    :secondary-account="accountMap.get(transaction.secondaryAccount)"
                    :category="categoryMap.get(transaction.category as number)" />
                <div class="divider my-0" />
            </template>
        </div>
        <div v-else class="italic text-center text-neutral-400 max-w-[960px]">
            No transactions found!
        </div>
    </div>
</template>

<style scoped>
.divider:last-child {
    display: none;
}
</style>