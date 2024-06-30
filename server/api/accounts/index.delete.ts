import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    // send entire account as body
    // only id is needed, maybe shorten
    const body:Account = await readBody(event)

    db.run(`
        DELETE FROM accounts WHERE id=?
    `, [body.id])

    db.close()

    return `deleted account id${body.id} (hopefully)`
})