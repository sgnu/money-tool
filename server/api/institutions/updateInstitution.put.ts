import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Institution = await readBody(event)

    const data = db.run(`
        UPDATE institutions
        SET name=?, url=?, icon=?
        WHERE id=?
        RETURNING *
    `, [body.name, body.url, body.icon, body.id])

    db.close()

    return data
})