"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NewInvoiceFormProps {
  onClose: () => void
}

export function NewInvoiceForm({ onClose }: NewInvoiceFormProps) {
  const router = useRouter()

  const handleCreateInvoice = () => {
    router.push("/dashboard/billing/invoice-builder")
    onClose()
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <p>You'll be redirected to our comprehensive invoice builder where you can:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Select clients and date ranges</li>
          <li>Automatically calculate invoices based on hours worked</li>
          <li>Customize line items and add notes</li>
          <li>Preview and send invoices</li>
        </ul>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateInvoice}>Continue to Invoice Builder</Button>
      </div>
    </div>
  )
}
