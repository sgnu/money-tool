import { createRequire } from 'module'
import convertSQLAccount from '~/utils/convertSQLAccount'

export default eventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const institutionNumber = getRouterParam(event, 'id')

    if (!institutionNumber) {
        return null
    }

    const accounts = new Promise<Account[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM accounts
            WHERE institution_id=?
        `, [institutionNumber],
        (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            const tempArray:Account[] = []

            rows.forEach((account: SQLAccount) => {
                const tempAccount = convertSQLAccount(account)
                if (tempAccount) {
                    tempArray.push(tempAccount)
                }
            })

            resolve(tempArray)
        })
    })

    db.close()

    return accounts
})