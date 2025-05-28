"use client"

interface InvoiceSummaryProps {
  subtotal: number
  tax: number
  total: number
  taxEnabled: boolean
  taxRate: number
}

export function InvoiceSummary({ subtotal, tax, total, taxEnabled, taxRate }: InvoiceSummaryProps) {
  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {taxEnabled && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax ({taxRate}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-md pt-2 border-t">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}
