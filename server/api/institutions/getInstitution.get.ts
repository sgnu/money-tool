import { createRequire } from 'module'

export default defineEventHandler(async () => {
    const institutions = await sqlCall()
    return institutions
})

function sqlCall() {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    const promise = new Promise((resolve, reject) => {
        db.all(`
            SELECT * from institutions
        `, (err: any, rows: any) => {
            if (err) {
                reject(err)
            }

            resolve(rows)
        })
    })

    db.close((err: any) => {
        if (err) {
            console.error(err)
        }
    })

    return promise
}