import { createRequire } from 'module'
import convertSQLAccount from '~/utils/convertSQLAccount'

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