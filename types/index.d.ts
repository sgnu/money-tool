export {  }

declare global {
    interface Institution {
        id: number,
        name: string,
        url: string,
        icon: string
    }

    interface Account {
        id: number,
        name: string,
        accountNumber: number,
        accountType: AccountTypes,
        institutionId: number,
        initialBalance: number,
        currentBalance: number,
    }

    interface SQLAccount {
        account_number: number,
        account_type: string,
        current_balance: number,
        id: number,
        initial_balance: number,
        institution_id: number,
        name: string,
    }

    interface Transaction {
        name?: string,
        id: number,
        type: TransactionTypes,
        date: Date,
        amount: number,
        primaryAccount: number,
        secondaryAccount?: number,
    }

    interface SQLTransaction {
    id: number,
    name: string,
    type: string,
    date: string,
    amount: number,
    primary_account: number,
    secondary_account: number
}
}