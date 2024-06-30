<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes';
import { TransactionTypes } from '~/types/TransactionTypes';

const props = defineProps<{
    primaryAccount: Account,
    secondaryAccount: Account,
    transaction: Transaction,
    accountView?: boolean,
}>()

const amount = computed(() => {
    return formatMoney(props.transaction.amount)
})

const amountClasses = computed(() => {
    let classes = ''
    if (props.accountView) {
        if (props.transaction.type === TransactionTypes.PAYMENT) {
            classes = 'text-red'
        }
    }

    return classes
})

const date = computed(() => {
    // date gets flattened to string for some reason; convert back to Date object
    return new Date(props.transaction.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: '2-digit'
    })
})
</script>

<template>
    <div class="flex flex-wrap">
        <h2 class="basis-auto grow font-semibold" v-if="transaction.name.length > 0">{{ transaction.name }}</h2>
        <h2 class="basis-auto grow italic text-neutral-300" v-else>Unnamed Transaction</h2>
        <p>...{{ primaryAccount.accountNumber }} <span v-if="secondaryAccount"> to ...{{ secondaryAccount.accountNumber }}</span></p>
        <FlexBreak />
        <p class="basis-auto grow">{{ date }}</p>
        <p :class="amountClasses">{{ transaction.type }} ${{ amount }}</p>
    </div>
</template>