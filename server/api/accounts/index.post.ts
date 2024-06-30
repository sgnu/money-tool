import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Account = await readBody(event)

    const data = db.run(`
        INSERT INTO accounts (name, account_number, account_type, institution_id, initial_balance, current_balance)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *
    `, [body.name, body.accountNumber, body.accountType, body.institutionId, body.initialBalance, body.currentBalance])
    // when submitting initial data, current balance should be set equal to initial balance

    db.close()

    return data
})