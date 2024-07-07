import { createRequire } from 'module'
import convertSQLTransaction from '~/utils/convertSQLTransaction'

export default defineEventHandler(async () => {
    const transactionData = await sqlCall()
    const transactions: Transaction[] = []


    transactionData.forEach(transaction => {
        const converted = convertSQLTransaction(transaction)
        if (converted) {
            transactions.push(converted)
        } else {
            // ???
        }
    })

    return transactions
})

function sqlCall() {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise<SQLTransaction[]>((resolve, reject) => {
        db.all(`
            SELECT * from transactions
            ORDER BY 
                date DESC,
                id DESC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            resolve(rows)
        })
    })

    db.close((err: any) => {
        if (err) {
            console.error(err)
        }
    })

    return promise
}