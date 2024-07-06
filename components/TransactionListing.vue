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
        day: 'numeric',
        timeZone: 'UTC'
    })
})
</script>

<template>
    <!-- TODO: fix text overflow when really narrow screen or long title -->
    <div class="flex flex-wrap">
        <div class="flex w-full">
            <h2 class="basis-auto font-semibold text-nowrap text-ellipsis" v-if="transaction.name.length > 0">{{ transaction.name }}</h2>
            <h2 class="basis-auto italic text-neutral-300 text-nowrap text-ellipsis" v-else>Unnamed Transaction</h2>
            <p class="ml-auto text-nowrap">...{{ primaryAccount.accountNumber }} <span v-if="secondaryAccount"> to ...{{ secondaryAccount.accountNumber }}</span></p>
        </div>
        <FlexBreak />
        <p class="basis-auto">{{ date }}</p>
        <p :class="amountClasses" class="ml-auto text-nowrap">{{ transaction.type }} ${{ amount }}</p>
    </div>
</template>