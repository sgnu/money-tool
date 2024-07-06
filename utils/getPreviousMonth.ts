export default function(date: Date | string): Date {
    // https://stackoverflow.com/questions/605575/getting-the-previous-months-first-date-from-current-date-in-javascript
    const newDate = new Date(date)
    newDate.setDate(0)  // sets to last day of previous month
    newDate.setDate(1)  // sets to first day of previous month; probably unneccessary

    return newDate
}