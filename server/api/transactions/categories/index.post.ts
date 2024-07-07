import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Category = await readBody(event)

    const data = db.run(`
        INSERT INTO categories (name, icon)
        VALUES (?, ?)
        RETURNING *
    `, [body.name, body.icon])

    db.close()

    return data
})