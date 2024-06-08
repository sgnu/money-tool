<script setup lang="ts">
import { TransactionTypes } from '~/types/TransactionTypes'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

let isLoading = ref(true)

const { data: accounts } = await useFetch('/api/accounts/getAllAccounts', {
    onResponse() {
        setTimeout(() => {
            isLoading.value = false
        }, 250)
    }
})

const accountMap = new Map();
(accounts.value as any).forEach((tempAccount: Account) => {
    accountMap.set(tempAccount.name, tempAccount.id)
})

const formData = reactive({
    name: '',
    type: null,
    date: '',
    amount: null,
    primaryAccount: null,
    secondaryAccount: null
})

const submit = () => {
    const tempTransaction = {
        name: formData.name,
        type: formData.type,
        date: new Date(formData.date),
        amount: formData.amount,
        primaryAccount: formData.primaryAccount,
        secondaryAccount: formData.secondaryAccount
    }

    console.log(tempTransaction)

    $fetch('/api/transactions/create', {
        method: 'POST',
        body: tempTransaction,
        onResponse() {
            setTimeout(() => {
              navigateTo('/transactions')  
            })
        }
    })
}

</script>

<template>
    <div class="flex justify-center">
        <Transition name="loading-form">
            <FormCard v-if="isLoading">
                <div class="skeleton w-full h-12"></div>
            </FormCard>
            <FormCard v-else @submit.prevent="submit">
                <h1 class="text-center text-2xl w-full pb-2">New Transaction</h1>
                <label class="input input-bordered flex items-center gap-2 w-full">
                    Name
                    <input type="text" class="grow" v-model="formData.name" />
                </label>
                <select class="select select-bordered w-full max-w-xs" v-model="formData.type">
                    <option disabled selected>Type</option>
                    <option v-for="type in TransactionTypes">{{ type }}</option>
                </select>
                <VueDatePicker v-model="formData.date" :dark="true" :enable-time-picker="false" auto-apply placeholder="Date" />
                <label class="input input-bordered flex items-center gap-2 w-full">
                    Amount
                    <input type="text" class="grow" v-model="formData.amount" />
                </label>
                <select class="select select-bordered w-full max-w-xs" v-model="formData.primaryAccount">
                    <option disabled selected>Primary Account</option>
                    <option v-for="account in (accounts)" :value="account.id">{{ account.name }} ...{{ account.accountNumber }}</option>
                </select>
                <select class="select select-bordered w-full max-w-xs" v-model="formData.secondaryAccount">
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