import { createRequire } from 'module'
import convertSQLTransaction from '~/utils/convertSQLTransaction'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')
    
    const account = parseInt(getRouterParam(event, 'id') as string)
    const year = parseInt(getRouterParam(event, 'year') as string)
    const month = parseInt(getRouterParam(event, 'month') as string)

    if (!account || !year || !month) {
        return null
    }

    const promise = new Promise<Transaction[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM transactions
            ORDER BY date DESC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const filteredTransactions = rows.filter((transaction: SQLTransaction) => {
                const date = new Date(transaction.date)
                return (
                    (
                        transaction.primary_account === account ||
                        transaction.secondary_account === account
                    ) &&
                    date.getFullYear() === year &&
                    (date.getUTCMonth() + 1) === month
                )
            }) as SQLTransaction[]

            const transactions = filteredTransactions.map(transaction => convertSQLTransaction(transaction)) as Transaction[]

            resolve(transactions)
        })
    })

    db.close()
    return promise
})