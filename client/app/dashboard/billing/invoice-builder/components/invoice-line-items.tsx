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
      const roundedValue = Math.round(numValue * 100) / 100
      updatedItem = {
        ...item,
        [field]: roundedValue,
        amount: field === "quantity" ? roundedValue * item.rate : item.quantity * roundedValue,
      }
    } else {
      updatedItem = { ...item, [field]: value }
    }

    onUpdateItem(updatedItem)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <Skeleton className="h-10 col-span-6" />
            <Skeleton className="h-10 col-span-2" />
            <Skeleton className="h-10 col-span-2" />
            <Skeleton className="h-10 col-span-2" />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">
          No items yet. Select a client and date range to generate line items, or add items manually.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 font-medium text-sm text-muted-foreground">
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
              inputSize="default"
            />
          </div>
          <div className="col-span-2">
            <CustomInput
              type="number"
              min="0"
              step="0.5"
              value={item.quantity.toString()}
              onChange={(value) => handleItemChange(item.id, "quantity", value)}
              variant="default"
              inputSize="default"
            />
          </div>
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <CustomInput
                type="number"
                min="0"
                step="1"
                value={Math.floor(item.rate).toString()}
                onChange={(value) => {
                  // Ensure only whole numbers for rate
                  const numValue = Math.floor(Number.parseFloat(value) || 0)
                  handleItemChange(item.id, "rate", numValue.toString())
                }}
                className="pl-7"
                variant="default"
                inputSize="default"
              />
            </div>
          </div>
          <div className="col-span-1 font-medium">${item.amount.toFixed(2)}</div>
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
