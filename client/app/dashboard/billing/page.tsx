"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./components/date-range-picker"
import { InvoiceTable } from "./components/invoice-table"
import { ProfitCalculator } from "./components/profit-calculator"
import { ShiftReview } from "./components/shift-review"
import BillingStats from "./components/billing-stats"
import { BillingActions } from "./components/billing-actions"
import { Filter, Plus } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { subDays } from "date-fns"
import { ProfitabilityProjections } from "./components/profitability-projections"
import { BillingReports } from "./components/billing-reports"
import { BillingSettings } from "./components/billing-settings"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch } from "@/state/redux"
import { setSelectedDateRange as setPayrollDateRange } from "@/state/slices/payrollSlice"
import { setSelectedDateRange as setExpensesDateRange } from "@/state/slices/expensesSlice"

import BillingAnalytics from "./components/billing-analytics"
import { PayrollTable } from "./components/payroll-table"
import { ExpensesTable } from "./components/expenses-table"
import { useRouter } from "next/navigation"
import { NewPayrollForm } from "./components/new-payroll-form"
import { NewExpenseForm } from "./components/new-expense-form"
import { PayrollActions } from "./components/payroll-actions"
import { ExpensesActions } from "./components/expenses-actions"
import MileageTable from "./components/mileage-table"

export default function BillingPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    // State for active tab
    const [activeTab, setActiveTab] = useState("invoices")

    // State for filter visibility
    const [showFilters, setShowFilters] = useState(false)

    // State for new payroll dialog
    const [showNewPayrollDialog, setShowNewPayrollDialog] = useState(false)

    // State for new expense dialog
    const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false)

    // Update date range in Redux when it changes
    const handleDateRangeChange = (value: DateRange | undefined | ((prevState: DateRange | undefined) => DateRange | undefined)) => {
        if (typeof value === 'function') {
            setDateRange(value)
        } else {
            setDateRange(value)
            if (value) {
                if (activeTab === "payroll") {
                    dispatch(setPayrollDateRange(value))
                } else if (activeTab === "expenses") {
                    dispatch(setExpensesDateRange(value))
                }
            }
        }
    }

    return (
        <div className="p-6 space-y-4">
            <BillingStats />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <TabsList className="mb-2 md:mb-0">
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                        <TabsTrigger value="payroll">Payroll</TabsTrigger>
                        <TabsTrigger value="expenses">Expenses</TabsTrigger>
                        <TabsTrigger value="mileage">Mileage</TabsTrigger>
                        <TabsTrigger value="shift-review">Shift Review</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
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

                <TabsContent value="payroll" className="space-y-4">
                    <PayrollActions showFilters={showFilters} />
                    <PayrollTable date={dateRange} />
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                    <ExpensesActions showFilters={showFilters} />
                    <ExpensesTable date={dateRange} />
                </TabsContent>

                <TabsContent value="mileage" className="space-y-4">
                    <MileageTable />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <BillingAnalytics />
                </TabsContent>
            </Tabs>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {activeTab === "invoices" ? (
                    <Button
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg"
                        onClick={() => router.push("/dashboard/billing/invoice-builder")}
                    >
                        <Plus className="h-7 w-7" />
                    </Button>
                ) : activeTab === "payroll" ? (
                    <Button
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg"
                        onClick={() => setShowNewPayrollDialog(true)}
                    >
                        <Plus className="h-7 w-7" />
                    </Button>
                ) : activeTab === "expenses" ? (
                    <Button
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg"
                        onClick={() => setShowNewExpenseDialog(true)}
                    >
                        <Plus className="h-7 w-7" />
                    </Button>
                ) : null}
            </div>

            {/* New Payroll Dialog */}
            <Dialog open={showNewPayrollDialog} onOpenChange={setShowNewPayrollDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Payroll Entry</DialogTitle>
                    </DialogHeader>
                    <NewPayrollForm onClose={() => setShowNewPayrollDialog(false)} />
                </DialogContent>
            </Dialog>

            {/* New Expense Dialog */}
            <Dialog open={showNewExpenseDialog} onOpenChange={setShowNewExpenseDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Expense</DialogTitle>
                    </DialogHeader>
                    <NewExpenseForm onClose={() => setShowNewExpenseDialog(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
