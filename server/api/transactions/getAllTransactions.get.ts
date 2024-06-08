import { createRequire } from 'module'

export default defineEventHandler(async () => {
    const transactionData = await sqlCall()
    const transactions: Transaction[] = []

    transactionData.forEach(transaction => {
        const newTransaction: Transaction = {
            id: transaction.id,
            name: transaction.name,
            type: transaction.type,
            date: new Date(transaction.date),
            amount: transaction.amount,
            primaryAccount: transaction.primary_account,
            secondaryAccount: transaction.secondary_account
        }

        transactions.push(newTransaction)
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

interface SQLTransaction {
    id: number,
    name: string,
    type: string,
    date: string,
    amount: number,
    primary_account: number,
    secondary_account: number
}