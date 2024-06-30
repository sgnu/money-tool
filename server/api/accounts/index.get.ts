import { createRequire } from 'module'

export default eventHandler(async () => {
    const accountData: any = await sqlCall()
    const accounts: Account[] = []

    accountData.forEach((account: SQLAccount) => {
        const newAccount: Account = {
            id: account.id,
            name: account.name,
            accountNumber: account.account_number,
            accountType: account.account_type,
            institutionId: account.institution_id,
            initialBalance: account.initial_balance,
            currentBalance: account.current_balance
        }
        accounts.push(newAccount)
    })
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