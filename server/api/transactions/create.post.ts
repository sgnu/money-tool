import { createRequire } from 'module'
import { AccountTypes } from '~/types/AccountTypes'
import { TransactionTypes } from '~/types/TransactionTypes'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Transaction = await readBody(event)

    const primaryAccount: Account | null = await getAccount(body.primaryAccount, db)
    const secondaryAccount: Account | null = await getAccount(body.secondaryAccount, db)

    console.log(primaryAccount)

    if (body.type === TransactionTypes.TRANSFER) {
        // Transfers should only be between checkings and savings accounts
        // and should have both primary and secondary.
        // TODO: add check that accounts are the right type
        // Subtract from primary; add to secondary
        if (primaryAccount !== null && secondaryAccount !== null) {
            db.run(`
                UPDATE accounts
                SET current_balance=?
                WHERE id=?
            `, [primaryAccount.current_balance - body.amount, primaryAccount.id])

            db.run(`
                UPDATE accounts
                SET current_balance=?
                WHERE id=?
            `, [secondaryAccount.current_balance + body.amount, secondaryAccount.id])
        } else {
            return null
        }
    }

    const date = new Date(body.date).toISOString()

    const data = db.run(`
        INSERT INTO transactions (name, type, date, amount, primary_account, secondary_account)
        VALUES (?, ?, DATE(?), ?, ?, ?)
        RETURNING *
    `, [body.name, body.type, date, body.amount, body.primaryAccount, body.secondaryAccount])

    db.close()

    return data
})

async function getAccount(accountId: number | undefined, db: any) {
    const promise = new Promise<Account | null>((resolve, reject) => {
        db.get(`
            SELECT * FROM accounts
            WHERE id=?
        `, [accountId], (err: any, row: Account | null) => {
            if (err) {
                reject(err)
            }

            resolve(row)
        })
    })

    return promise
}