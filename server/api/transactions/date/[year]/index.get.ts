import { createRequire } from 'module'
import convertSQLTransaction from '~/utils/convertSQLTransaction'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')
    
    const year = parseInt(getRouterParam(event, 'year') as string)
    if (!year) {
        return null
    }

    const promise = new Promise<Transaction[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM transactions
            ORDER BY
                date DESC,
                id ASC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const filteredTransactions = rows.filter((transaction: SQLTransaction) => {
                return (new Date(transaction.date).getFullYear() === year)
            }) as SQLTransaction[]

            const transactions = filteredTransactions.map(transaction => convertSQLTransaction(transaction)) as Transaction[]

            resolve(transactions)
        })
    })

    db.close()
    return promise
})