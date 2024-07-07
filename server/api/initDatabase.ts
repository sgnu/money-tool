import { createRequire } from 'module'

export default defineEventHandler((event) => {
    const require = createRequire(import.meta.url)
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database('./data/data.db')

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS institutions (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                url TEXT,
                icon TEXT
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY,
                name TEXT,
                account_number INTEGER,
                account_type TEXT NOT NULL,
                institution_id INTEGER NOT NULL,
                initial_balance INTEGER NOT NULL,
                current_balance INTEGER NOT NULL,

                FOREIGN KEY (institution_id)
                    REFERENCES institutions (id)
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY,
                name TEXT,
                type TEXT NOT NULL,
                date TEXT NOT NULL,
                amount INTEGER NOT NULL,
                primary_account INTEGER NOT NULL,
                secondary_account INTEGER,
                category INTEGER,

                FOREIGN KEY (primary_account)
                    REFERENCES accounts (id),

                FOREIGN KEY (secondary_account)
                    REFERENCES accounts (id),

                FOREIGN KEY (category)
                    REFERENCES categories (id)
            )
        `)

        db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                icon TEXT
            )
        `)
    })

    db.close()
    return('maybe success')
})