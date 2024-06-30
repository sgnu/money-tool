export default function(amount: number) {
    return amount.toLocaleString(undefined, {minimumFractionDigits: 2})
}