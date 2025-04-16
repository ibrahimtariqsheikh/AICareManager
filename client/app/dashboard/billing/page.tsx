"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./components/date-range-picker"
import { InvoiceTable } from "./components/invoice-table"
import { ProfitCalculator } from "./components/profit-calculator"
import { ShiftReview } from "./components/shift-review"
import { BillingStats } from "./components/billing-stats"
import { BillingActions } from "./components/billing-actions"
import { Download, FileText, Filter, Plus, Settings, Sparkles } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { addDays, format, subDays } from "date-fns"
import { ProfitabilityProjections } from "./components/profitability-projections"
import { BillingReports } from "./components/billing-reports"
import { BillingSettings } from "./components/billing-settings"
import { NewInvoiceForm } from "./components/new-invoice-form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function BillingPage() {
    // State for date range
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    // State for active tab
    const [activeTab, setActiveTab] = useState("invoices")

    // State for filter visibility
    const [showFilters, setShowFilters] = useState(false)

    // State for new invoice dialog
    const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false)

    // Format date range for display
    const formatDateRange = () => {
        if (!dateRange?.from || !dateRange?.to) return "Select date range"
        return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
    }

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Billing & Finance</h1>
                    <p className="text-neutral-700">
                        Manage invoices, track payments, and analyze financial performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => setShowNewInvoiceDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Invoice
                    </Button>
                </div>
            </div>

            <BillingStats />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList className="mb-2 md:mb-0">
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                        <TabsTrigger value="profit-calculator">Profit Calculator</TabsTrigger>
                        <TabsTrigger value="shift-review">Shift Review</TabsTrigger>
                        <TabsTrigger value="projections">Profitability</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="invoices" className="space-y-6">
                    <BillingActions showFilters={showFilters} />
                    <InvoiceTable date={dateRange} />
                </TabsContent>

                <TabsContent value="profit-calculator" className="space-y-6">
                    <ProfitCalculator />
                </TabsContent>

                <TabsContent value="shift-review" className="space-y-6">
                    <ShiftReview date={dateRange} />
                </TabsContent>

                <TabsContent value="projections" className="space-y-6">
                    <ProfitabilityProjections dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                    <BillingReports dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <BillingSettings />
                </TabsContent>
            </Tabs>

            <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <NewInvoiceForm onClose={() => setShowNewInvoiceDialog(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
