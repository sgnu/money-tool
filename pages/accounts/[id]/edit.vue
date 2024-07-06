<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';

const route = useRoute()
const institutionLoading = ref(true)
const accountLoading = ref(true)

const institutions = ref(<Institution[]>[])
const institutionMap = new Map()

let formData = reactive({
    id: <null | number> null,
    name: <null | string> null,
    accountNumber: <null | number> null,
    accountType: <null | AccountTypes> null,
    institution: <null | string> null,
    initialBalance: <null | number> null,
    currentBalance: <null | number> null,   // not exposed to user
})

// (institutions.value as any).forEach((tempInstitution: Institution) => {
//     institutionMap.set(tempInstitution.name, tempInstitution.id)   
// })

onMounted(async () => {
    await nextTick(async () => {
        // get institutions info
        await $fetch(`/api/institutions`, {
            onResponse({ response }) {
                const institutionArray = response._data as Institution[]
                institutionArray.forEach(institution => {
                    institutions.value.push(institution)
                    institutionMap.set(institution.name, institution.id)
                })

                setTimeout(() => {
                    institutionLoading.value = false
                }, useRuntimeConfig().minimumLoading)
            }
        })

        // get account info
        await $fetch(`/api/accounts/${route.params.id}`, {
            onResponse({ response }) {
                const account = response._data as Account

                let institutionName
                institutionMap.forEach((id, name) => {
                    if (id === account.institutionId) {
                        institutionName = name
                    }
                })

                formData = {
                    id: account.id,
                    name: account.name,
                    accountNumber: account.accountNumber,
                    accountType: account.accountType,
                    institution: institutionName as any,
                    initialBalance: account.initialBalance,
                    currentBalance: account.currentBalance
                }

                setTimeout(() => {
                    accountLoading.value = false
                }, useRuntimeConfig().minimumLoading)
            }
        })
    })
})

const submit = () => {
    const tempAccount = {
        id: formData.id,
        name: formData.name,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        institutionId: institutionMap.get(formData.institution),
        initialBalance: formData.initialBalance,
        currentBalance: formData.currentBalance
    }

    $fetch('/api/accounts', {
        method: 'PUT',
        body: tempAccount,
        onResponse() {
            setTimeout(() => {
                navigateTo(`/accounts/${formData.id}`)
            })
        }
    })
}
</script>

<template>
    <div class="flex justify-center">
        <Transition name="loading-form">
            <FormCard v-if="institutionLoading || accountLoading">
                <div class="skeleton w-full h-12"></div>
                <div class="skeleton w-full h-12"></div>
                <div class="skeleton w-full h-12"></div>
            </FormCard>
            <FormCard v-else @submit.prevent="submit">
                <h1 class="text-center text-2xl w-full">Edit Account</h1>
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
                <FormLabel class="text-sm">
                    Initial Balance
                    <input  type="text" inputmode="numeric" pattern="\d*(\.\d{1,2})?" class="grow text-base"  title="Whole number or to 2 decimal places" v-model="formData.initialBalance">
                </FormLabel>
                <input type="submit" class="btn btn-primary" @submit="submit" value="Submit">
            </FormCard>
        </Transition>
    </div>
</template>