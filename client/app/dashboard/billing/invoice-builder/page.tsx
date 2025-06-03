"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ClientSelector } from "./components/client-selector"
import { InvoiceLineItems } from "./components/invoice-line-items"
import { InvoiceSummary } from "./components/invoice-summary"
import { toast } from "sonner"
import { ArrowLeft, Download, Plus } from "lucide-react"
import { InvoicePaymentMethod } from "@/types/prismaTypes"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import type { InvoiceItem } from "./types"

import { generatePDF } from "./components/utils/pdf-generator"
import { PDFPreview } from "./components/pdf-preview"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { setInvoiceData, setInvoices, setSelectedDateRange } from "@/state/slices/invoiceSlice"
import { InvoiceSettings } from "./components/invoice-settings"
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range"
import { useCreateInvoiceMutation } from "@/state/api"
import { format } from "date-fns"

export default function InvoiceBuilderPage() {
    const router = useRouter()
    const [showAddItemPopover, setShowAddItemPopover] = useState(false)

    const selectedClient = useAppSelector((state) => state.invoice.selectedClient)
    const dispatch = useAppDispatch()
    const invoices = useAppSelector((state) => state.invoice.invoices)
    const invoiceData = useAppSelector((state) => state.invoice.invoiceData)
    const selectedDateRange = useAppSelector((state) => state.invoice.selectedDateRange)
    const items = useAppSelector((state) => state.invoice.invoiceData?.predefinedItems || [])
    const agencyId = useAppSelector((state) => state.user.user.userInfo?.agencyId)

    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
    const [isLoading, _] = useState(false)
    const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation()

    const handleAddPredefinedItems = useCallback(() => {
        console.log("Current invoiceData:", invoiceData)
        if (!invoiceData?.predefinedItems?.length) {
            console.log("No predefined items to add")
            return
        }

        console.log("Adding predefined items:", invoiceData.predefinedItems.map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
        })))

        const newItems = invoiceData.predefinedItems.map(item => {
            console.log("Processing item:", {
                type: item.serviceType,
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount
            })

            const updatedItem = {
                id: `${item.serviceType}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
                description: item.description,
                quantity: item.quantity,
                rate: Math.round(item.rate),
                amount: Math.round(item.quantity * item.rate),
                serviceType: item.serviceType,
                careWorkerId: item.careWorkerId
            }

            console.log("Created updated item:", {
                type: updatedItem.serviceType,
                description: updatedItem.description,
                quantity: updatedItem.quantity,
                rate: updatedItem.rate,
                amount: updatedItem.amount
            })

            return updatedItem
        })

        console.log("New items to add:", newItems.map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
        })))

        console.log("Previous items:", items.map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
        })))

        setInvoiceItems(prevItems => [...prevItems, ...newItems])
        console.log("Updated items:", [...prevItems, ...newItems].map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
        })))
    }, [invoiceData, items])

    const handleAddManualItem = () => {
        const newItem: InvoiceItem = {
            id: `manual-${Date.now()}`,
            description: "",
            quantity: 0,
            rate: 0,
            amount: 0,
            serviceType: "CUSTOM",
            careWorkerId: "",
        }
        setInvoiceItems(prevItems => [...prevItems, newItem])
        setShowAddItemPopover(false)
    }

    const handleAddItem = () => {
        if (invoiceData?.predefinedItems?.length) {
            setShowAddItemPopover(true)
        } else {
            handleAddManualItem()
        }
    }

    const handleUpdateItem = (updatedItem: InvoiceItem) => {
        setInvoiceItems(invoiceItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }

    const handleRemoveItem = (itemId: string) => {
        setInvoiceItems(invoiceItems.filter((item) => item.id !== itemId))
    }

    const handleCreateInvoice = async () => {
        if (!selectedClient || !selectedDateRange?.from || !selectedDateRange?.to || !invoiceData || !agencyId) {
            toast.error("Please fill in all required fields before creating an invoice.")
            return
        }

        if (invoiceItems.length === 0) {
            toast.error("Please add at least one item to the invoice.")
            return
        }

        try {
            const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
            const tax = invoiceData.taxEnabled ? (subtotal * invoiceData.taxRate) / 100 : 0
            const total = subtotal + tax

            const newInvoice = {
                agencyId,
                clientId: selectedClient.id,
                description: `Invoice for services from ${format(new Date(selectedDateRange.from), "MMM d, yyyy")} to ${format(new Date(selectedDateRange.to), "MMM d, yyyy")}`,
                issueDate: invoiceData.issueDate || new Date().toISOString(),
                dueDate: invoiceData.dueDate || new Date().toISOString(),
                paymentMethod: (invoiceData.paymentMethod || "BANK_TRANSFER") as InvoicePaymentMethod,
                invoiceItems: invoiceItems.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount
                })),
                taxRate: invoiceData.taxEnabled ? invoiceData.taxRate || 0 : 0,
                totalAmount: total,
                notes: invoiceData.notes || "",
                fromHoursDate: new Date(selectedDateRange.from).toISOString(),
                toHoursDate: new Date(selectedDateRange.to).toISOString()
            }

            console.log("Creating invoice with data:", newInvoice)
            await createInvoice(newInvoice).unwrap()
            toast.success("Invoice created successfully")
            router.push("/dashboard/billing")
        } catch (error) {
            console.error("Error creating invoice:", error)
            toast.error("Failed to create invoice")
        }
    }

    const handleDownloadPDF = async () => {
        if (!selectedClient) {
            toast.error("Please select a client first")
            return
        }

        if (!invoiceData) {
            toast.error("Invoice data is not available")
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
                invoiceData
            )

            // Download the PDF
            doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
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
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-md font-bold">Create New Invoice</h1>
                </div>
                <div className="flex items-center gap-2">

                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleCreateInvoice}
                        disabled={isCreatingInvoice}
                    >
                        {isCreatingInvoice ? "Creating..." : "Create Invoice"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <ClientSelector />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateRange">Date Range</Label>
                                    <MyCustomDateRange
                                        initialDateRange={useAppSelector((state) => {
                                            const range = state.invoice.selectedDateRange
                                            if (!range) return undefined
                                            return {
                                                from: range.from ? new Date(range.from) : new Date(),
                                                to: range.to ? new Date(range.to) : new Date()
                                            }
                                        })}
                                        onRangeChange={(range) => {
                                            if (range) {
                                                dispatch(setSelectedDateRange({
                                                    from: range.from.toISOString(),
                                                    to: range.to.toISOString()
                                                }))
                                            } else {
                                                dispatch(setSelectedDateRange(null))
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <InvoiceSettings />

                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <Popover open={showAddItemPopover} onOpenChange={setShowAddItemPopover}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={handleAddItem}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Item
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="space-y-4">
                                                <h4 className="font-medium leading-none">Add Items</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Would you like to add the predefined items (expenses and schedule hours) or add a manual item?
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={handleAddPredefinedItems}>
                                                        Add Predefined Items
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={handleAddManualItem}>
                                                        Add Manual Item
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <InvoiceLineItems
                                    items={invoiceItems}
                                    onUpdateItem={handleUpdateItem}
                                    onRemoveItem={handleRemoveItem}
                                    isLoading={isLoading}
                                />
                                <div className="flex justify-end border-t pt-4">
                                    <InvoiceSummary
                                        subtotal={calculateSubtotal()}
                                        tax={calculateTax()}
                                        total={calculateTotal()}
                                        taxEnabled={invoiceData?.taxEnabled ?? false}
                                        taxRate={invoiceData?.taxRate ?? 0}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 border rounded-md"
                                    placeholder="Enter any additional notes or payment instructions..."
                                    value={invoiceData?.notes ?? ""}
                                    onChange={(e) => dispatch(setInvoiceData({ ...invoiceData, notes: e.target.value }))}
                                />
                            </div>
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

            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/billing")}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateInvoice}
                    disabled={isCreatingInvoice}
                >
                    {isCreatingInvoice ? "Creating..." : "Create Invoice"}
                </Button>
            </div>
        </div>
    )
}
