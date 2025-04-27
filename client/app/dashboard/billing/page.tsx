"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./components/date-range-picker"
import { InvoiceTable } from "./components/invoice-table"
import { ProfitCalculator } from "./components/profit-calculator"
import { ShiftReview } from "./components/shift-review"
import { BillingStats } from "./components/billing-stats"
import { BillingActions } from "./components/billing-actions"
import { Download, Filter, Plus } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
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


    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Billing & Finance</h1>
                    <p className="text-sm text-neutral-600">
                        Manage invoices, track payments, and analyze financial performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 shadow-none">
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
