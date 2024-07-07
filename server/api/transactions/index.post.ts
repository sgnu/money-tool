import { createRequire } from 'module'
import { AccountTypes } from '~/types/AccountTypes'
import { TransactionTypes } from '~/types/TransactionTypes'
import convertSQLAccount from '~/utils/convertSQLAccount'
import updateAccountBalances from '~/utils/updateAccountBalances'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Transaction = await readBody(event)

    const primaryAccount: Account | null = await getAccount(body.primaryAccount, db)
    const secondaryAccount: Account | null = await getAccount(body.secondaryAccount, db)

    updateAccountBalances(primaryAccount, secondaryAccount, body.type, body.amount as number)

    const date = new Date(body.date).toISOString()

    let name

    if (body.name) {
        name = body.name.length > 0 ? body.name : null
    } else {
        name = null
    }

    if (secondaryAccount) {
        db.run(`
            INSERT INTO transactions (name, type, date, amount, primary_account, secondary_account, category)
            VALUES (?, ?, DATE(?), ?, ?, ?, ?)
            RETURNING *
        `, [name, body.type, date, body.amount, body.primaryAccount, body.secondaryAccount, body.category])
    } else {
        db.run(`
            INSERT INTO transactions (name, type, date, amount, primary_account, category)
            VALUES (?, ?, DATE(?), ?, ?, ?)
            RETURNING *
        `, [body.name, body.type, date, body.amount, body.primaryAccount, body.category])
    }


    db.close()
})

async function getAccount(accountId: number | undefined, db: any) {
    const promise = new Promise<Account | null>((resolve, reject) => {
        db.get(`
            SELECT * FROM accounts
            WHERE id=?
        `, [accountId], (err: any, row: SQLAccount | null) => {
            if (err) {
                reject(err)
            }

            try {
                resolve(convertSQLAccount(row))
            } catch {
                resolve(null)
            }
        })
    })

    return promise
}