<script setup lang="ts">
import { AccountTypes } from '~/types/AccountTypes'
import { TransactionTypes } from '~/types/TransactionTypes'

const props = defineProps<{
    primaryAccount: Account,
    secondaryAccount: Account,
    transaction: Transaction,
}>()
</script>

<template>
    <CardBase>
        <div class="card-body">
            <h2 class="card-title">{{ transaction.name }}</h2>
            <p>{{ transaction.amount }}</p>
            <p>{{ primaryAccount.accountNumber }}<span v-if="transaction.secondaryAccount">to {{ secondaryAccount.accountNumber }}</span></p>
        </div>
    </CardBase>
</template>