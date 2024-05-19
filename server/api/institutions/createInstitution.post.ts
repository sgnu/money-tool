import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Institution = await readBody(event)

    const data = db.run(`
        INSERT INTO institutions (name, url, icon)
        VALUES (?, ?, ?)
        RETURNING *
    `, [body.name, body.url, body.icon])

    db.close()

    return data
})