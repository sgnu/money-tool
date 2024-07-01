import { AccountTypes } from "~/types/AccountTypes"
import { TransactionTypes } from "~/types/TransactionTypes"

export default function(primaryAccount: Account | null, secondaryAccount: Account | null, transactionType: TransactionTypes, balanceChange: number): boolean {
    const tempPrimaryAccount = primaryAccount
    const tempSecondaryAccount = secondaryAccount
    if (transactionType === TransactionTypes.TRANSFER) {
        // Transfers should only be between checkings and savings accounts
        // Should have both primary and secondary accounts.
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
    } else if (transactionType === TransactionTypes.INCOME) {
        // Income should be directly into a checking or savings account
        // Should only be primary account
        // Add to primary
        if (tempPrimaryAccount !== null && tempSecondaryAccount === null) {
            if (tempPrimaryAccount.accountType === AccountTypes.CHECKINGS || tempPrimaryAccount.accountType === AccountTypes.SAVINGS) {
                tempPrimaryAccount.currentBalance += balanceChange

                sendFetch(tempPrimaryAccount)

                return true
            }
        }
    } else if (transactionType === TransactionTypes.INTEREST) {
        // Interest should be directly into a checking, savings, credit, or liability account
        // Should only be primary account
        // Add to primary
        if (tempPrimaryAccount !== null && tempSecondaryAccount === null) {
            if (
                tempPrimaryAccount.accountType === AccountTypes.CHECKINGS ||
                tempPrimaryAccount.accountType === AccountTypes.SAVINGS ||
                tempPrimaryAccount.accountType === AccountTypes.CREDIT ||
                tempPrimaryAccount.accountType === AccountTypes.LIABILITY
            ) {
                tempPrimaryAccount.currentBalance += balanceChange

                sendFetch(tempPrimaryAccount)

                return true
            }
        }
    } else if (transactionType === TransactionTypes.ADJUSTMENT) {
        // Adjustment directly changes current balance
        // Should only be primary account
        // Set primary to balance
        if (tempPrimaryAccount !== null && tempSecondaryAccount === null) {
            tempPrimaryAccount.currentBalance = balanceChange

            sendFetch(tempPrimaryAccount)

            return true
        }
    } else if (transactionType === TransactionTypes.PURCHASE) {
        // Purchase should be made with checkings, savings, or credit accounts
        // Should only be primary account
        // Subtract from primary if checkings or savings; add to credit
        if (tempPrimaryAccount !== null && tempSecondaryAccount === null) {
            if (tempPrimaryAccount.accountType === AccountTypes.CHECKINGS || tempPrimaryAccount.accountType === AccountTypes.SAVINGS) {
                tempPrimaryAccount.currentBalance -= balanceChange
            } else if (tempPrimaryAccount.accountType === AccountTypes.CREDIT) {
                tempPrimaryAccount.currentBalance += balanceChange
            }

            sendFetch(tempPrimaryAccount)

            return true
        }
    }

    // Return value should be denote success
    // maybe change to return array of accounts?
    return false
}

async function sendFetch(account: Account) {
    await $fetch('/api/accounts', {
        method: 'PUT',
        body: account
    })
}