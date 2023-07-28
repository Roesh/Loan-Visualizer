export const amountTickFormatter = (amount: number) => {
    return amountFormatter(amount)
}

export const amountFormatter = (amount: number, displayDecimals: boolean = false) => {
    if ((amount / 1000) >= 1) {
        return `\$${(amount / 1000).toFixed(displayDecimals ? 3: 0)}k`
    }
    return `\$${(amount / 1000).toFixed(3)}k`
}