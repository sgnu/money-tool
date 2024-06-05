import { createRequire } from 'module'

export default defineEventHandler(async () => {
    const transactions = await sqlCall()
    return transactions
})

function sqlCall() {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise<Transaction[]>((resolve, reject) => {
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