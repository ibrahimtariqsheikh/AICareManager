"use client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { InvoiceItem } from "../types"
import { CustomInput } from "@/components/ui/custom-input"
import { cn } from "@/lib/utils"


interface InvoiceLineItemsProps {
  items: InvoiceItem[]
  onUpdateItem: (item: InvoiceItem) => void
  onRemoveItem: (itemId: string) => void
  isLoading: boolean
}

export function InvoiceLineItems({ items, onUpdateItem, onRemoveItem, isLoading }: InvoiceLineItemsProps) {
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    let updatedItem: InvoiceItem

    if (field === "quantity" || field === "rate") {
      const numValue = Number.parseFloat(value) || 0
      const processedValue = field === "rate" ? Math.round(numValue) : numValue
      updatedItem = {
        ...item,
        [field]: processedValue,
        amount: field === "quantity" ? processedValue * item.rate : item.quantity * processedValue,
      }
    } else {
      updatedItem = { ...item, [field]: value }
    }

    onUpdateItem(updatedItem)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <Skeleton className="h-8 col-span-6" />
            <Skeleton className="h-8 col-span-2" />
            <Skeleton className="h-8 col-span-2" />
            <Skeleton className="h-8 col-span-2" />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-4 border rounded-md">
        <p className="text-sm text-muted-foreground">
          No items yet. Select a client and date range to generate line items, or add items manually.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
        <div className="col-span-6">Description</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Rate</div>
        <div className="col-span-2">Amount</div>
      </div>

      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-6">
            <CustomInput
              value={item.description}
              onChange={(value) => handleItemChange(item.id, "description", value)}
              placeholder="Enter description"
              variant="default"
              inputSize="sm"
            />
          </div>
          <div className="col-span-2">
            <CustomInput
              type="number"
              min="0"
              step="0.01"
              value={item.quantity.toFixed(2)}
              onChange={(value) => handleItemChange(item.id, "quantity", value)}
              variant="default"
              inputSize="sm"
            />
          </div>
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">$</span>
              <CustomInput
                type="number"
                min="0"
                step="1"
                value={Math.round(item.rate).toString()}
                onChange={(value) => {
                  const numValue = Math.round(Number.parseFloat(value) || 0)
                  handleItemChange(item.id, "rate", numValue.toString())
                }}
                className="pl-6 text-sm"
                variant="default"
                inputSize="sm"
              />
            </div>
          </div>
          <div className="col-span-1 text-sm font-medium">${Math.round(item.amount)}</div>
          <div className="col-span-1 text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
