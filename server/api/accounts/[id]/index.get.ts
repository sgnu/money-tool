import { createRequire } from 'module'
import convertSQLAccount from '~/utils/convertSQLAccount'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const id = getRouterParam(event, 'id')

    const promise = new Promise<Account>((resolve, reject) => {
        db.get(`
            SELECT * FROM accounts
            WHERE ID = ?
        `, [id],
        (err:any, row: SQLAccount) => {
            if (err) {
                reject(err)
            }

            const account = convertSQLAccount(row)

            if (account) {
                resolve(account)
            } else {
                reject(null)
            }
        })
    })

    db.close()

    return promise
})