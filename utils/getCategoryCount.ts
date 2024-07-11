export default function(transactions: Transaction[], category: Category) {
    return transactions.reduce<number>((accumulator, currentValue) => {
        if (currentValue.category && currentValue.category === category.id) {
            return accumulator + 1
        } else {
            return accumulator
        }
    }, 0)
}