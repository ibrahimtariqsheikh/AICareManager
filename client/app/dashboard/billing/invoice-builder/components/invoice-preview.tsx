"use client"

import { format } from "date-fns"
import type { InvoiceItem } from "../types"
import type { DateRange } from "react-day-picker"
import { useAppSelector } from "@/state/redux"

interface InvoicePreviewProps {
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  dateRange: DateRange | undefined
}

export function InvoicePreview({ items, subtotal, tax, total, dateRange }: InvoicePreviewProps) {
  const invoiceData = useAppSelector((state) => state.invoice.invoiceData)
  const client = useAppSelector((state) => state.invoice.selectedClient)
  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Client Selected</h3>
        <p className="text-muted-foreground mt-2">Please select a client to preview the invoice</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-lg border">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
          <div className="mt-4">
            <p className="font-bold">AI Care Manager</p>
            <p>{client.addressLine1}</p>
            <p>{client.addressLine2}</p>
            <p>{client.townOrCity}</p>
            <p className="mt-2">{client.postalCode}</p>
            <p>{client.phoneNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="h-16 w-16 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">ACM</span>
          </div>
          <p className="mt-4 font-medium">Invoice #{invoiceData?.invoiceNumber}</p>
          <p className="text-muted-foreground">Issue Date: {format(new Date(invoiceData?.issueDate || new Date()), "MMM d, yyyy")}</p>
          <p className="text-muted-foreground">Due Date: {format(new Date(invoiceData?.dueDate || new Date()), "MMM d, yyyy")}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-700">Bill To:</h2>
        <div className="mt-2">
          <p className="font-medium">{client.name}</p>
          <p>{client.address}</p>
          <p>
            {client.city}, {client.state} {client.postalCode}
          </p>
          <p>{client.country}</p>
          <p className="mt-2">{client.email}</p>
          <p>{client.phone}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-700">Service Period:</h2>
        <p className="mt-1">
          {dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
            : "No date range selected"}
        </p>
      </div>

      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-4">{item.description}</td>
                <td className="py-4 text-right">{item.quantity.toFixed(2)}</td>
                <td className="py-4 text-right">${item.rate.toFixed(2)}</td>
                <td className="py-4 text-right">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {invoiceData?.taxEnabled && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Tax ({invoiceData?.taxRate}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoiceData?.notes && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-700">Notes:</h2>
          <p className="mt-2 text-gray-600 whitespace-pre-line">{invoiceData?.notes}</p>
        </div>
      )}

      <div className="mt-12 text-center text-gray-500 text-sm">

        <p className="mt-1">Payment is due by {format(new Date(invoiceData?.dueDate || new Date()), "MMM d, yyyy")}</p>
      </div>
    </div>
  )
}
