"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ClientSelector } from "./components/client-selector"
import { InvoiceLineItems } from "./components/invoice-line-items"

import { InvoiceSummary } from "./components/invoice-summary"
import { InvoiceSettings } from "./components/invoice-settings"
import { toast } from "sonner"
import { ArrowLeft, Save, Send, Download, Plus } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"

import type { Client, CareWorker, InvoiceItem, InvoiceData } from "./types"
import { fetchClients, fetchCareWorkers, fetchClientHours } from "./api/mock-api"
import { generateInvoiceNumber } from "./components/utils/invoice-utils"
import { generatePDF } from "./components/utils/pdf-generator"
import { DatePickerWithRange } from "@/components/scheduler/date-range"
import { PDFPreview } from "./components/pdf-preview"

export default function InvoiceBuilderPage() {
    const router = useRouter()
    const [clients, setClients] = useState<Client[]>([])
    const [careWorkers, setCareWorkers] = useState<CareWorker[]>([])
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -14),
        to: new Date(),
    })
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        invoiceNumber: generateInvoiceNumber(),
        issueDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        notes: "",
        taxRate: 0,
        taxEnabled: false,
    })

    // Load clients and care workers on component mount
    useEffect(() => {
        const loadData = async () => {
            const clientsData = await fetchClients()
            const careWorkersData = await fetchCareWorkers()
            setClients(clientsData)
            setCareWorkers(careWorkersData)
        }
        loadData()
    }, [])

    // Generate invoice items when client and date range are selected
    useEffect(() => {
        const generateInvoiceItems = async () => {
            if (!selectedClient || !dateRange?.from || !dateRange?.to) return

            setIsLoading(true)
            try {
                // Fetch hours worked for the selected client in the date range
                const hoursData = await fetchClientHours(selectedClient.id, dateRange.from, dateRange.to)

                // Group hours by care worker and service type
                const groupedItems: Record<string, InvoiceItem> = {}

                hoursData.forEach((entry) => {
                    const key = `${entry.careWorkerId}-${entry.serviceType}`
                    if (!groupedItems[key]) {
                        const careWorker = careWorkers.find((cw) => cw.id === entry.careWorkerId)
                        groupedItems[key] = {
                            id: key,
                            description: `${entry.serviceType} - ${careWorker?.firstName} ${careWorker?.lastName || ""}`,
                            quantity: entry.hours,
                            rate: selectedClient.rates[entry.serviceType] || 0,
                            amount: (selectedClient.rates[entry.serviceType] || 0) * entry.hours,
                            serviceType: entry.serviceType,
                            careWorkerId: entry.careWorkerId,
                        }
                    } else {
                        groupedItems[key].quantity += entry.hours
                        groupedItems[key].amount = groupedItems[key].rate * groupedItems[key].quantity
                    }
                })

                setInvoiceItems(Object.values(groupedItems))
            } catch (error) {
                console.error("Error generating invoice items:", error)
                toast.error("Failed to generate invoice items")
            } finally {
                setIsLoading(false)
            }
        }

        if (selectedClient && dateRange?.from && dateRange?.to) {
            generateInvoiceItems()
        }
    }, [selectedClient, dateRange, careWorkers])

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client)
        if (!client) {
            setInvoiceItems([])
        }
    }

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

    const handleSaveInvoice = () => {
        // In a real app, this would save the invoice to your backend
        toast.success("Invoice saved successfully")
    }

    const handleSendInvoice = () => {
        // In a real app, this would send the invoice to the client
        toast.success("Invoice sent to client")
    }

    const handleDownloadPDF = () => {
        if (!selectedClient) {
            toast.error("Please select a client first")
            return
        }

        try {
            // Generate PDF
            const doc = generatePDF(
                selectedClient,
                invoiceData,
                invoiceItems,
                calculateSubtotal(),
                calculateTax(),
                calculateTotal(),
                dateRange,
            )

            // Download the PDF
            doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
            toast.success("PDF downloaded successfully")
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast.error("Failed to generate PDF")
        }
    }

    const calculateSubtotal = () => {
        return invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    }

    const calculateTax = () => {
        return invoiceData.taxEnabled ? calculateSubtotal() * (invoiceData.taxRate / 100) : 0
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
                    <Button variant="outline" onClick={handleSaveInvoice}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={handleSendInvoice}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invoice
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
                                    <ClientSelector
                                        clients={clients}
                                        selectedClient={selectedClient}
                                        onClientChange={handleClientChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Service Period</Label>
                                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <InvoiceSettings invoiceData={invoiceData} setInvoiceData={setInvoiceData} />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Line Items</CardTitle>
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
                                taxEnabled={invoiceData.taxEnabled}
                                taxRate={invoiceData.taxRate}
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
                                value={invoiceData.notes}
                                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
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
                                client={selectedClient}
                                invoiceData={invoiceData}
                                items={invoiceItems}
                                subtotal={calculateSubtotal()}
                                tax={calculateTax()}
                                total={calculateTotal()}
                                dateRange={dateRange}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
