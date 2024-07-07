export default function(sqlTransaction: SQLTransaction | null): Transaction | null {
    return sqlTransaction !== null ? {
        name: sqlTransaction.name,
        id: sqlTransaction.id,
        type: sqlTransaction.type,
        date: new Date(sqlTransaction.date),
        amount: sqlTransaction.amount,
        primaryAccount: sqlTransaction.primary_account,
        secondaryAccount: sqlTransaction.secondary_account,
        category: sqlTransaction.category
    } : null
}