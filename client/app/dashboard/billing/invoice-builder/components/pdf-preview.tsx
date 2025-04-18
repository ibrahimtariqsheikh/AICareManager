"use client"

import { format } from "date-fns"
import type { InvoiceData, InvoiceItem } from "../types"
import { User } from "@/types/prismaTypes"
import { useAppSelector } from "@/state/redux"

interface PDFPreviewProps {

  invoiceData: InvoiceData
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number

}

export function PDFPreview({ invoiceData, items, subtotal, tax, total }: PDFPreviewProps) {
  const selectedClient: User | null = useAppSelector((state) => state.invoice.selectedClient)
  const dateRange = useAppSelector((state) => state.invoice.selectedDateRange)

  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No Client Selected</h3>
        <p className="text-muted-foreground mt-2">Please select a client to preview the invoice</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* PDF Controls - mimicking PDF viewer controls */}
      <div className="bg-gray-100 border-b flex items-center justify-between p-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <span className="text-sm">Page 1 of 1</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div
        className="bg-white border-l border-r border-b rounded-b-lg shadow-md overflow-auto"
        style={{ height: "calc(100vh - 250px)", padding: "40px", position: "relative" }}
      >
        {/* PDF Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-30deg]">
          <span className="text-6xl font-bold text-gray-500">PREVIEW</span>
        </div>

        {/* PDF Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <div className="mt-4">
                <p className="font-bold">AI Care Manager</p>
                <p>123 Care Street</p>
                <p>Toronto, ON M5V 2K4</p>
                <p>Canada</p>
                <p className="mt-2">contact@aicaremanager.com</p>
                <p>+1 (416) 555-1234</p>
              </div>
            </div>
            <div className="text-right">
              <div className="h-16 w-16 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">ACM</span>
              </div>
              <p className="mt-4 font-medium">Invoice #{invoiceData.invoiceNumber}</p>
              <p className="text-muted-foreground">
                Issue Date: {format(new Date(invoiceData.issueDate), "MMM d, yyyy")}
              </p>
              <p className="text-muted-foreground">Due Date: {format(new Date(invoiceData.dueDate), "MMM d, yyyy")}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-700">Bill To:</h2>
            <div className="mt-2">
              <p className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</p>
              <p>{selectedClient.email}</p>

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
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-gray-700">Description</th>
                  <th className="py-2 px-4 text-right text-gray-700">Quantity</th>
                  <th className="py-2 px-4 text-right text-gray-700">Rate</th>
                  <th className="py-2 px-4 text-right text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 px-4">{item.description}</td>
                    <td className="py-4 px-4 text-right">{item.quantity.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">${item.amount.toFixed(2)}</td>
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
              {invoiceData.taxEnabled && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Tax ({invoiceData.taxRate}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoiceData.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-700">Notes:</h2>
              <p className="mt-2 text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
            </div>
          )}

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p className="mt-1">Payment is due by {format(new Date(invoiceData.dueDate), "MMM d, yyyy")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
