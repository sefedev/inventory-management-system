export const priceFormatter = (price) => {
    const formatPrice = new Intl.NumberFormat("en-NG", { style: "decimal",currencySign:"standard" }).format(price.toFixed(2))
    
    return `₦${formatPrice}`
}