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

    interface Transaction {
        name: string,
        id: number,
        type: TransactionTypes,
        date: Date,
        amount: number,
        primaryAccount: number,
        secondaryAccount?: number,
    }
}