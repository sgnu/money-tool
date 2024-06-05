import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Transaction = await readBody(event)

    const data = db.run(`
        INSERT INTO transactions (name, type, date, amount, primary_account, secondary_account)
        VALUES (?, ?, DATE(?), ?, ?, ?)
        RETURNING *
    `, [body.name, body.type, body.date.toISOString(), body.amount, body.primaryAccount, body.secondaryAccount])

    db.close()

    return data
})