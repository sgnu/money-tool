import { createRequire } from 'module'

export default eventHandler(async () => {
    const accounts = await sqlCall()
    return accounts
})

function sqlCall() {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM accounts
            ORDER BY id ASC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            resolve(rows)
        })
    })

    db.close((err:any) => {
        if (err) {
            console.error(err)
        }
    })

    return promise
}