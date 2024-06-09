import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Account = await readBody(event)

    const data = db.run(`
        UPDATE accounts
        SET name=?, account_number=?, account_type=?, institution_id=?, initial_balance=?, current_balance=?
        WHERE id=?
        RETURNING *
    `, [body.name, body.accountNumber, body.accountType, body.institutionId, body.initialBalance, body.currentBalance, body.id])

    db.close()

    return data
})