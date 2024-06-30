import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    // send entire transation as body
    // only id is needed, maybe shorten
    const body:Transaction = await readBody(event)

    db.run(`
        DELETE FROM transactions WHERE id=?
    `, [body.id])

    db.close()

    return `deleted transaction id${body.id} (hopefully)`
})