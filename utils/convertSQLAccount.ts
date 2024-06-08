export default function(sqlAccount: SQLAccount | null ): Account | null {
    return sqlAccount !== null ? {
        id: sqlAccount.id,
        name: sqlAccount.name,
        accountNumber: sqlAccount.account_number,
        accountType: sqlAccount.account_type,
        institutionId: sqlAccount.institution_id,
        initialBalance: sqlAccount.initial_balance,
        currentBalance: sqlAccount.current_balance
    } : null
}