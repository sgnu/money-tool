export default function() {
    const defaultCategories: Category[] = [
        {
            id: 1,
            name: 'Shopping',
            icon: '🛒'
        },
        {
            id: 2,
            name: 'Housing',
            icon: '🏠'
        },
        {
            id: 3,
            name: 'Dining',
            icon: '🍽️'
        },
        {
            id: 4,
            name: 'Groceries',
            icon: '🍞'
        },
        {
            id: 5,
            name: 'Transportation',
            icon: '🚗'
        },
        {
            id: 6,
            name: 'Travel',
            icon: '✈️'
        },
        {
            id: 7,
            name: 'Savings',
            icon: '💰'
        }
    ]

    defaultCategories.forEach(async category => {
        await $fetch('/api/transactions/categories', {
            method: 'post',
            body: category
        })
    })
}