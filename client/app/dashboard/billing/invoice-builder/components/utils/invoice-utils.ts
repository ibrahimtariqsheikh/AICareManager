export function generateInvoiceNumber(): string {
  const prefix = "INV"
  const date = new Date()
  const year = date.getFullYear().toString().slice(2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `${prefix}-${year}${month}-${randomDigits}`
}
