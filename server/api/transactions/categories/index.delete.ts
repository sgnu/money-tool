import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    // send entire category as body
    // only id is needed, maybe shorten
    const body:Category = await readBody(event)

    db.run(`
        DELETE FROM categories WHERE id=?
    `, [body.id])

    db.close()

    return `deleted category id${body.id} (hopefully)`
})