import { createRequire } from 'module'
import { TransactionTypes } from '~/types/TransactionTypes'
import updateAccountBalances from '~/utils/updateAccountBalances'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Transaction = await readBody(event)

    const primaryAccount: Account | null = await $fetch(`/api/accounts/${body.primaryAccount}`)
    const secondaryAccount: Account | null = await $fetch(`/api/accounts/${body.secondaryAccount}`)

    // get previous transaction to calculate difference
    const oldTransaction = await $fetch(`/api/transactions/${body.id}`)

    let difference = 0
    if (body.type === TransactionTypes.ADJUSTMENT) {
        // adjustments change account balance to an absolute value rather than relatively
        difference = body.amount
    } else {
        difference = body.amount - oldTransaction.amount
    }
    
    updateAccountBalances(primaryAccount, secondaryAccount, body.type, difference)

    // updating transaction should not change accounts
    // too annoying to handle anything besides changing amount
    // user should delete transaction then create new transaction
    const data = db.run(`
        UPDATE transactions
        SET amount=?
        WHERE id=?
        RETURNING *
    `, [body.amount, body.id])

    db.close()

    return data
})