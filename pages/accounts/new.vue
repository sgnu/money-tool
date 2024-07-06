<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';
let isLoading = ref(true)

const { data: institutions } = await useFetch('/api/institutions', {
    onResponse() {
        setTimeout(() => {
            isLoading.value = false
        }, useRuntimeConfig().minimumLoading)
    }
})

const institutionMap = new Map();

(institutions.value as any).forEach((tempInstitution: Institution) => {
    institutionMap.set(tempInstitution.name, tempInstitution.id)
})

const formData = reactive({
    name: '',
    accountNumber: null,
    accountType: AccountTypes.CHECKINGS,
    institution: (institutions.value as any[])[0].name,
    initialBalance: null
})

const submit = () => {
    const tempAccount = {
        name: formData.name,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        institutionId: institutionMap.get(formData.institution),
        initialBalance: formData.initialBalance,
        currentBalance: formData.initialBalance
    }

    console.log(tempAccount)

    $fetch('/api/accounts', {
        method: 'POST',
        body: tempAccount,
        onResponse() {
            setTimeout(() => {
                navigateTo('/accounts')
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
                <div class="skeleton w-full h-12"></div>
                <div class="skeleton w-full h-12"></div>
            </FormCard>
            <FormCard v-else @submit.prevent="submit">
                <h1 class="text-center text-2xl w-full">New Account</h1>
                <select class="select select-bordered w-full max-w-xs" v-model="formData.institution">
                    <option disabled selected>Institution</option>
                    <option v-for="institution in (institutions as Institution[])">{{ institution.name }}</option>
                </select>
                <FormLabel>
                    Name
                    <input type="text" class="grow" v-model="formData.name">
                </FormLabel>
                <FormLabel>
                    Account #
                    <input type="text" inputmode="numeric" pattern="\d*" class="grow"  title="Numbers only" v-model="formData.accountNumber">
                </FormLabel>
                <select class="select select-bordered w-full max-w-xs" v-model="formData.accountType">
                    <option disabled selected>Account Type</option>
                    <option v-for="type in AccountTypes">{{ type }}</option>
                </select>
                <FormLabel>
                    Balance
                    <input type="text" inputmode="numeric" pattern="\d*(\.\d{1,2})?" class="grow"  title="Whole number or to 2 decimal places" v-model="formData.initialBalance">
                </FormLabel>
                <input type="submit" class="btn btn-primary" @submit="submit">
            </FormCard>
        </Transition>
    </div>
</template>

<style scoped>
.loading-form-enter-active,
.loading-form-leave-active {
    transition: all 0.1s ease-out;
    position: absolute;
}

.loading-form-enter-from,
.loading-form-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>