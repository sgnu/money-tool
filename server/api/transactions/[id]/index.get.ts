import { createRequire } from 'module'

export default defineEventHandler(async (event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const id = getRouterParam(event, 'id')

    const promise = new Promise<Transaction>((resolve, reject) => {
        db.get(`
            SELECT * FROM transactions
            WHERE ID = ?
        `, [id],
        (err:any, row: any) => {
            if (err) {
                reject(err)
            }

            resolve(row)
        })
    })

    db.close()

    return promise
})