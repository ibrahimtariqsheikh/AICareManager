"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ClientSelector } from "./components/client-selector"
import { InvoiceLineItems } from "./components/invoice-line-items"
import { InvoiceSummary } from "./components/invoice-summary"
import { toast } from "sonner"
import { ArrowLeft, Download, Plus } from "lucide-react"

import type { InvoiceItem } from "./types"

import { generatePDF } from "./components/utils/pdf-generator"
import { PDFPreview } from "./components/pdf-preview"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { CustomDateRangeSelector } from "./components/custom-date-range"
import { setInvoiceData, setInvoices } from "@/state/slices/invoiceSlice"
import { InvoiceSettings } from "./components/invoice-settings"



export default function InvoiceBuilderPage() {
    const router = useRouter()

    const selectedClient = useAppSelector((state) => state.invoice.selectedClient)
    const dispatch = useAppDispatch()
    const invoices = useAppSelector((state) => state.invoice.invoices)
    const invoiceData = useAppSelector((state) => state.invoice.invoiceData)

    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
    const [isLoading, _] = useState(false)

    const handleAddItem = () => {
        const newItem: InvoiceItem = {
            id: `manual-${Date.now()}`,
            description: "",
            quantity: 0,
            rate: 0,
            amount: 0,
            serviceType: "CUSTOM",
            careWorkerId: "",
        }
        setInvoiceItems([...invoiceItems, newItem])
    }

    const handleUpdateItem = (updatedItem: InvoiceItem) => {
        setInvoiceItems(invoiceItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }

    const handleRemoveItem = (itemId: string) => {
        setInvoiceItems(invoiceItems.filter((item) => item.id !== itemId))
    }

    const handleSendInvoice = () => {
        dispatch(setInvoices([...(invoices || []), invoiceData]))
    }

    const handleDownloadPDF = async () => {
        if (!selectedClient) {
            toast.error("Please select a client first")
            return
        }

        try {
            // Generate PDF
            const doc = await generatePDF(
                selectedClient,
                invoiceItems,
                calculateSubtotal(),
                calculateTax(),
                calculateTotal(),
            )

            // Download the PDF
            doc.save(`Invoice-${invoiceData?.invoiceNumber}.pdf`)
            toast.success("PDF downloaded successfully")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error(error instanceof Error ? error.toString() : "An unknown error occurred")
        }
    }

    const calculateSubtotal = () => {
        return invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    }

    const calculateTax = () => {
        return invoiceData?.taxEnabled ? calculateSubtotal() * (invoiceData.taxRate / 100) : 0
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax()
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Create New Invoice</h1>
                </div>
                <div className="flex items-center gap-2">

                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={handleSendInvoice}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client & Date Range</CardTitle>
                            <CardDescription>Select the client and service period for this invoice</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <ClientSelector />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateRange">Date Range</Label>
                                    <CustomDateRangeSelector />
                                </div>

                            </div>

                        </CardContent>
                    </Card>

                    <InvoiceSettings

                    />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Services</CardTitle>
                                <CardDescription>Services provided during the selected period</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleAddItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <InvoiceLineItems
                                items={invoiceItems}
                                onUpdateItem={handleUpdateItem}
                                onRemoveItem={handleRemoveItem}
                                isLoading={isLoading}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <InvoiceSummary
                                subtotal={calculateSubtotal()}
                                tax={calculateTax()}
                                total={calculateTotal()}
                                taxEnabled={invoiceData?.taxEnabled ?? false}
                                taxRate={invoiceData?.taxRate ?? 0}
                            />
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>Add any additional notes to the invoice</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                className="w-full min-h-[100px] p-3 border rounded-md"
                                placeholder="Enter any additional notes or payment instructions..."
                                value={invoiceData?.notes ?? ""}
                                onChange={(e) => dispatch(setInvoiceData({ ...invoiceData, notes: e.target.value }))}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Invoice Preview</CardTitle>
                            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <PDFPreview
                                items={invoiceItems}
                                subtotal={calculateSubtotal()}
                                tax={calculateTax()}
                                total={calculateTotal()}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
