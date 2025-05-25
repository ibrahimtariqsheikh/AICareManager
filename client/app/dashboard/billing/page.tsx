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
import { Filter } from 'lucide-react'
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
        <div className="p-6 space-y-4">
            <BillingStats />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <TabsList className="mb-2 md:mb-0">
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                        <TabsTrigger value="payroll">Payroll</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="shift-review">Shift Review</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="invoices" className="space-y-4">
                    <BillingActions showFilters={showFilters} />
                    <InvoiceTable date={dateRange} />
                </TabsContent>

                <TabsContent value="profit-calculator" className="space-y-4">
                    <ProfitCalculator />
                </TabsContent>

                <TabsContent value="shift-review" className="space-y-4">
                    <ShiftReview date={dateRange} />
                </TabsContent>

                <TabsContent value="projections" className="space-y-4">
                    <ProfitabilityProjections dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <BillingReports dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
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
