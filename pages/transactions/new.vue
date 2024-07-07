<script setup lang="ts">
import { TransactionTypes } from '~/types/TransactionTypes'

const route = useRoute()
let accountLoading = ref(true)
let categoryLoading = ref(true)
const accounts = ref<Account[]>([])
// const accountMap = ref(new Map<number, Account>())

const categories = ref<Category[]>([])
const categoryMap = ref(new Map<number, Category>())

await $fetch('/api/accounts', {
    onResponse({ response }) {
        response._data.forEach((account: Account) => {
            accounts.value.push(account)
            // accountMap.value.set(account.id, account)
        })
        setTimeout(() => {
            accountLoading.value = false
        }, useRuntimeConfig().minimumLoading)
    }
})

await $fetch('/api/transactions/categories', {
    onResponse({ response }) {
        response._data.forEach((category: Category) => {
            categories.value.push(category)
            categoryMap.value.set(category.id, category)
        })
        setTimeout(() => {
            categoryLoading.value = false
        }, useRuntimeConfig().minimumLoading)
    }
})

const formData = reactive({
    name: <string | null> null,
    type: <TransactionTypes | null> null,
    date: initDate(),
    amount: null,
    primaryAccount: <string | null> null,
    secondaryAccount: <string | null> null,
    category: <string | null> null
})

if (route.query.primaryAccount) {
    formData.primaryAccount = route.query.primaryAccount as string
}
if (route.query.secondaryAccount) {
    formData.secondaryAccount = route.query.secondaryAccount as string
}
if (route.query.type) {
    formData.type = route.query.type as TransactionTypes
}

const submit = () => {
    const tempTransaction = {
        name: formData.name,
        type: formData.type,
        date: new Date(formData.date),
        amount: formData.amount,
        primaryAccount: formData.primaryAccount,
        secondaryAccount: formData.secondaryAccount,
        category: formData.category
    }

    console.log(tempTransaction)

    $fetch('/api/transactions', {
        method: 'POST',
        body: tempTransaction,
        onResponse() {
            setTimeout(() => {
              navigateTo('/transactions')  
            })
        }
    })
}

function initDate() {
    // month and day need to be zero padded
    const date = new Date()
    // getMonth() is zero-indexed
    const month = `${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}`
    const day = `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
    
    return `${date.getFullYear()}-${month}-${day}`
}
</script>

<template>
    <div class="flex justify-center">
        <Transition name="loading-form">
            <FormCard v-if="accountLoading || categoryLoading">
                <div class="skeleton w-full h-12"></div>
            </FormCard>
            <FormCard v-else @submit.prevent="submit">
                <h1 class="text-center text-2xl w-full pb-2">New Transaction</h1>
                <label class="input input-bordered flex items-center gap-2 w-full">
                    Name
                    <input type="text" class="grow" v-model="formData.name" />
                </label>
                <select class="select select-bordered w-full" v-model="formData.type">
                    <option disabled selected>Type</option>
                    <option v-for="type in TransactionTypes">{{ type }}</option>
                </select>
                <select class="select select-bordered w-full" v-model="formData.category">
                    <option disabled selected>Category</option>
                    <option :value="null" selected>Uncategorized</option>
                    <option v-for="category in categories" :value="category.id"><span v-if="category.icon && category.icon.length > 0">{{ category.icon }}</span> {{ category.name }}</option>
                </select>
                <input type="date" class="w-full px-4 py-2 bg-base-100 rounded" v-model="formData.date">
                <label class="input input-bordered flex items-center gap-2 w-full">
                    Amount
                    <input type="text" class="grow" v-model="formData.amount" />
                </label>
                <select class="select select-bordered w-full" v-model="formData.primaryAccount">
                    <option disabled selected>Primary Account</option>
                    <option v-for="account in (accounts)" :value="account.id">{{ account.name }} ...{{ account.accountNumber }}</option>
                </select>
                <select class="select select-bordered w-full" v-model="formData.secondaryAccount">
                    <option disabled selected>Secondary Account</option>
                    <option v-for="account in (accounts)" :value="account.id">{{ account.name }} ..{{ account.accountNumber }}</option>
                </select>
                <input type="submit" class="btn btn-primary" @submit="submit">
            </FormCard>
        </Transition>
    </div>
</template>

<style scoped>
/*
    TODO: style date picker to match daisyui
    maybe make a global style sheet
*/

.loading-form-enter-active,
.loading-form-leave-active {
    transition: all 0.1s ease-out;
    position: absolute;
}

.loading-form-enter-from,
.loading-form-leave-to {
    opacity: 0;
    transform: translateY(12);
}
</style>