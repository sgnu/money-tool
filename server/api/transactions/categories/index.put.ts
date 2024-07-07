import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const body:Category = await readBody(event)

    const data = db.run(`
        UPDATE categories
        SET name=?, icon=?
        WHERE id=?
        RETURNING *
    `, [body.name, body.icon, body.id])

    db.close()

    return data
})