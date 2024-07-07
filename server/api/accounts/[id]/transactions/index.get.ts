import { createRequire } from 'module'
import convertSQLTransaction from '~/utils/convertSQLTransaction'

export default defineEventHandler(async(event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const accountNumber = getRouterParam(event, 'id')

    if (!accountNumber) {
        return null
    }

    const primaryAccounts = new Promise<Transaction[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM transactions
            WHERE primary_account=?
        `, [accountNumber],
        (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const tempArray:Transaction[] = []

            rows.forEach((transaction: SQLTransaction) => {
                const tempTransaction = convertSQLTransaction(transaction)
                if (tempTransaction) {
                    tempArray.push(tempTransaction)
                }
            })

            resolve(tempArray)
        })
    })

    const secondaryAccounts = new Promise<Transaction[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM transactions
            WHERE secondary_account=?
        `, [accountNumber],
        (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const tempArray:Transaction[] = []

            rows.forEach((transaction: SQLTransaction) => {
                const tempTransaction = convertSQLTransaction(transaction)
                if (tempTransaction) {
                    tempArray.push(tempTransaction)
                }
            })

            resolve(tempArray)
        })
    })

    db.close()

    const transactionsArray:Transaction[] = (await primaryAccounts).concat(await secondaryAccounts)

    transactionsArray.sort((a, b) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)
        
        // sort transactions in descending order
        if (aDate > bDate) {
            // sort a before b
            return -1
        } else if (aDate < bDate) {
            // sort a after b
            return 1
        } else {
            // a is equal to b
            if (a.id > b.id) {
                // sort a before b
                return -1
            } else if (a.id < b.id) {
                // sort a after b
                return 1
            } else {
                // ids are equal
                return 0
            }
        }
    })

    return transactionsArray
})