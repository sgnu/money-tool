import { AccountTypes } from "~/types/AccountTypes"
import { TransactionTypes } from "~/types/TransactionTypes"

export default function(primaryAccount: Account | null, secondaryAccount: Account | null, transactionType: TransactionTypes, balanceChange: number): boolean {
    const tempPrimaryAccount = primaryAccount
    const tempSecondaryAccount = secondaryAccount
    if (transactionType === TransactionTypes.TRANSFER) {
        // Transfers should only be between checkings and savings accounts
        // and should have both primary and secondary accounts.
        // Subtract from primary; add to secondary
        if (tempPrimaryAccount !== null && tempSecondaryAccount !== null) {
            if ((tempPrimaryAccount.accountType === AccountTypes.CHECKINGS || tempPrimaryAccount.accountType === AccountTypes.SAVINGS) &&
                (tempSecondaryAccount.accountType === AccountTypes.CHECKINGS || tempSecondaryAccount.accountType === AccountTypes.SAVINGS)) {
                    tempPrimaryAccount.currentBalance -= balanceChange
                    tempSecondaryAccount.currentBalance += balanceChange

                    sendFetch(tempPrimaryAccount)
                    sendFetch(tempSecondaryAccount)

                    return true
                }
        }
    }

    // Return value should be denote success
    // maybe change to return array of accounts?
    return false
}

async function sendFetch(account: Account) {
    await $fetch('/api/accounts/update', {
        method: 'PUT',
        body: account
    })
}