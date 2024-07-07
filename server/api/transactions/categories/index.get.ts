import { createRequire } from 'module'

export default defineEventHandler(async () => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise<Category[]>((resolve, reject) => {
        db.all(`
            SELECT * FROM categories
            ORDER BY name ASC
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            resolve(rows)
        })
    })

    db.close()

    return promise
})