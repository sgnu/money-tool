import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Transaction = await readBody(event)

    const data = db.run(`
        UPDATE institutions
        SET type=?, date=DATE(?), amount=?, primary_account=?, secondary_account=?
        WHERE id=?
        RETURNING *
    `, [body.type, body.date.toISOString(), body.amount, body.primaryAccount, body.secondaryAccount, body.id])

    db.close()

    return data
})