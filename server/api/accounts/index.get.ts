import { createRequire } from 'module'
import convertSQLAccount from '~/utils/convertSQLAccount'

export default eventHandler(async () => {
    return await sqlCall()
})

function sqlCall() {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise<Account[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM accounts
            ORDER BY id ASC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const tempArray: Account[] = []

            rows.forEach((account: SQLAccount) => {
                const tempAccount = convertSQLAccount(account)
                console.log(tempAccount)
                if (tempAccount) {
                    tempArray.push(tempAccount)
                }
            })

            resolve(tempArray)
        })
    })

    db.close((err:any) => {
        if (err) {
            console.error(err)
        }
    })

    return promise
}