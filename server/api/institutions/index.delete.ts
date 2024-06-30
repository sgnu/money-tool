import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    // send entire instutition as body
    // only id is needed, maybe shorten
    const body:Institution = await readBody(event)

    db.run(`
        DELETE FROM institutions WHERE id=?
    `, [body.id])

    db.close()

    return `deleted institution id${body.id} (hopefully)`
})