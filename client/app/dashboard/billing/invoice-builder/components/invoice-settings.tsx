"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setInvoiceData, setInvoiceNumber } from "@/state/slices/invoiceSlice"
import { useGetCurrentInvoiceNumberQuery, useGetExpensesByDateRangeQuery, useGetScheduleHoursByDateRangeQuery } from "@/state/api"
import { MyCustomDateRange } from "../../components/my-custom-date-range"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { skipToken } from "@reduxjs/toolkit/query"
import type { InvoiceItem } from "../types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define payment methods enum
enum InvoicePaymentMethod {
  CASH = "CASH",
  CHEQUE = "CHEQUE",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  OTHER = "OTHER"
}

export function InvoiceSettings() {
  const invoiceData = useAppSelector((state) => state.invoice.invoiceData)
  const selectedDateRange = useAppSelector((state) => state.invoice.selectedDateRange)
  const { data: invoiceNumberData } = useGetCurrentInvoiceNumberQuery()
  const dispatch = useAppDispatch()

  const [expensesTimeout, setExpensesTimeout] = useState(false)
  const [scheduleHoursTimeout, setScheduleHoursTimeout] = useState(false)
  const [isUpdatingItems, setIsUpdatingItems] = useState(false)

  // Local state for tax settings
  const [localTaxEnabled, setLocalTaxEnabled] = useState(invoiceData?.taxEnabled ?? false)
  const [localTaxRate, setLocalTaxRate] = useState(invoiceData?.taxRate ?? 0)

  // Ref to track if we've initialized predefined items to prevent loops
  const predefinedItemsInitialized = useRef(false)

  // Sync local state with Redux
  useEffect(() => {
    setLocalTaxEnabled(invoiceData?.taxEnabled ?? false)
    setLocalTaxRate(invoiceData?.taxRate ?? 0)
  }, [invoiceData?.taxEnabled, invoiceData?.taxRate])

  // Memoize the formatted invoice number
  const formattedInvoiceNumber = useMemo(() => {
    if (invoiceNumberData) {
      const invoiceNumberString = (invoiceNumberData.invoiceNumber + 1).toString()
      return "ACM-" + invoiceNumberString + "-" + format(new Date(), "yyyy")
    }
    return ""
  }, [invoiceNumberData])

  // Handle tax settings changes with useCallback to prevent recreating the function
  const handleTaxEnabledChange = useCallback((checked: boolean) => {
    setLocalTaxEnabled(checked)
    const newTaxRate = checked ? localTaxRate : 0
    setLocalTaxRate(newTaxRate)

    dispatch(setInvoiceData({
      ...invoiceData,
      taxEnabled: checked,
      taxRate: newTaxRate
    }))
  }, [dispatch, invoiceData, localTaxRate])

  const handleTaxRateChange = useCallback((value: string) => {
    const rate = Number.parseFloat(value) || 0
    setLocalTaxRate(rate)
    dispatch(setInvoiceData({
      ...invoiceData,
      taxRate: rate
    }))
  }, [dispatch, invoiceData])

  // Convert ISO string dates to Date objects for the debounced range
  const [debouncedDateRange, setDebouncedDateRange] = useState<{ from: Date; to: Date } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDateRange?.from && selectedDateRange?.to) {
        setDebouncedDateRange({
          from: new Date(selectedDateRange.from),
          to: new Date(selectedDateRange.to)
        })
      } else {
        setDebouncedDateRange(null)
      }
    }, 500) // 500ms debounce
    return () => clearTimeout(timer)
  }, [selectedDateRange])

  // Get expenses and schedule hours data from API
  const { data: expensesData, isLoading: isLoadingExpenses } = useGetExpensesByDateRangeQuery(
    debouncedDateRange ? {
      startDate: debouncedDateRange.from.toISOString(),
      endDate: debouncedDateRange.to.toISOString()
    } : skipToken
  )

  const { data: scheduleHoursData, isLoading: isLoadingScheduleHours } = useGetScheduleHoursByDateRangeQuery(
    debouncedDateRange ? {
      startDate: debouncedDateRange.from.toISOString(),
      endDate: debouncedDateRange.to.toISOString()
    } : skipToken
  )
  console.log("scheduleHoursData", scheduleHoursData)
  console.log("expensesData", expensesData)

  // Set timeout states
  useEffect(() => {
    if (isLoadingExpenses) {
      const timer = setTimeout(() => setExpensesTimeout(true), 10000)
      return () => clearTimeout(timer)
    }
    setExpensesTimeout(false)
  }, [isLoadingExpenses])

  useEffect(() => {
    if (isLoadingScheduleHours) {
      const timer = setTimeout(() => setScheduleHoursTimeout(true), 10000)
      return () => clearTimeout(timer)
    }
    setScheduleHoursTimeout(false)
  }, [isLoadingScheduleHours])

  // Memoize the date range string to prevent unnecessary recalculations
  const dateRangeString = useMemo(() => {
    if (!debouncedDateRange?.from || !debouncedDateRange?.to) return ""
    return `${format(debouncedDateRange.from, "MMM d")} - ${format(debouncedDateRange.to, "MMM d")}`
  }, [debouncedDateRange])

  // Add expenses and schedule hours as predefined items
  useEffect(() => {
    if (isUpdatingItems || !dateRangeString) return

    // Only update if we haven't initialized yet
    if (predefinedItemsInitialized.current) return

    const updatePredefinedItems = async () => {
      setIsUpdatingItems(true)
      try {
        const predefinedItems: InvoiceItem[] = []

        // Add expenses if available
        if (expensesData?.totalAmount && expensesData.totalAmount > 0) {
          console.log("Adding expenses item:", expensesData)
          predefinedItems.push({
            id: `expenses-${Date.now()}`,
            description: `Expenses (${dateRangeString})`,
            quantity: 1,
            rate: Math.floor(expensesData.totalAmount),
            amount: Math.floor(expensesData.totalAmount),
            serviceType: "EXPENSES",
            careWorkerId: ""
          })
        }

        // Add schedule hours if available
        if (scheduleHoursData?.totalHours && scheduleHoursData.totalHours > 0) {
          console.log("Adding schedule hours item:", scheduleHoursData)
          const hours = scheduleHoursData.totalHours // Keep decimal places for hours
          const rate = Math.floor(scheduleHoursData.payRate || 0)
          const amount = Math.round(hours * rate) // Round the final amount

          predefinedItems.push({
            id: `hours-${Date.now()}`,
            description: `Schedule Hours (${dateRangeString})`,
            quantity: hours,
            rate: rate,
            amount: amount,
            serviceType: "SCHEDULE_HOURS",
            careWorkerId: ""
          })
        }

        if (predefinedItems.length > 0) {
          console.log("Setting predefined items:", predefinedItems.map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
          })))
          const updatedInvoiceData = {
            ...invoiceData,
            predefinedItems,
            issueDate: invoiceData?.issueDate || new Date().toISOString(),
            dueDate: invoiceData?.dueDate || new Date().toISOString()
          }
          console.log("Dispatching updated invoice data with items:", updatedInvoiceData.predefinedItems?.map(item => ({
            type: item.serviceType,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount
          })))
          dispatch(setInvoiceData(updatedInvoiceData))
          predefinedItemsInitialized.current = true
        }
      } finally {
        setIsUpdatingItems(false)
      }
    }

    updatePredefinedItems()
  }, [dateRangeString, dispatch, expensesData, scheduleHoursData, isUpdatingItems, invoiceData])

  // Add payment method handler
  const handlePaymentMethodChange = (value: string) => {
    dispatch(setInvoiceData({
      ...invoiceData,
      paymentMethod: value as InvoicePaymentMethod
    }))
  }

  const paymentMethodOptions = [
    { value: InvoicePaymentMethod.CASH, label: "Cash" },
    { value: InvoicePaymentMethod.CHEQUE, label: "Cheque" },
    { value: InvoicePaymentMethod.CARD, label: "Card" },
    { value: InvoicePaymentMethod.BANK_TRANSFER, label: "Bank Transfer" },
    { value: InvoicePaymentMethod.OTHER, label: "Other" }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="invoiceNumber" className="text-sm">Invoice Number</Label>
          <CustomInput
            id="invoiceNumber"
            value={formattedInvoiceNumber}
            disabled
            variant="default"
            inputSize="default"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="issueDate" className="text-sm">Issue Date</Label>
          <MyCustomDateRange
            oneDate={true}
            initialDateRange={invoiceData?.issueDate ? { from: new Date(invoiceData.issueDate), to: new Date(invoiceData.issueDate) } : undefined}
            onRangeChange={(range) => {
              if (range?.from) {
                dispatch(setInvoiceData({ ...invoiceData, issueDate: format(range.from, "yyyy-MM-dd") }))
              }
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dueDate" className="text-sm">Due Date</Label>
          <MyCustomDateRange
            oneDate={true}
            initialDateRange={invoiceData?.dueDate ? { from: new Date(invoiceData.dueDate), to: new Date(invoiceData.dueDate) } : undefined}
            onRangeChange={(range) => {
              if (range?.from) {
                dispatch(setInvoiceData({ ...invoiceData, dueDate: format(range.from, "yyyy-MM-dd") }))
              }
            }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="space-y-1">
          <Label htmlFor="paymentMethod" className="text-sm">Payment Method</Label>
          <CustomSelect
            value={invoiceData?.paymentMethod || InvoicePaymentMethod.BANK_TRANSFER}
            onChange={handlePaymentMethodChange}
            options={paymentMethodOptions}
            placeholder="Select payment method"
            variant="default"
            selectSize="default"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="taxEnabled"
              checked={localTaxEnabled}
              onCheckedChange={handleTaxEnabledChange}
            />
            <Label htmlFor="taxEnabled" className="text-sm">Enable Tax</Label>
          </div>
        </div>

        {localTaxEnabled && (
          <div className="space-y-2 border rounded-md p-3 bg-muted/10">
            <div className="space-y-1">
              <Label htmlFor="taxRate" className="text-sm">Tax Rate (%)</Label>
              <CustomInput
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 20"
                value={localTaxRate.toString()}
                onChange={handleTaxRateChange}
                variant="default"
                inputSize="default"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expenses" className="text-sm mb-1 block">Expenses</Label>
              {expensesTimeout ? (
                <Alert variant="destructive" className="mt-1 py-2">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    Loading expenses is taking longer than expected. Please try again.
                  </AlertDescription>
                </Alert>
              ) : isLoadingExpenses ? (
                <div className="mt-1 text-xs text-muted-foreground">Loading expenses...</div>
              ) : expensesData ? (
                <div className="mt-1">
                  <div className="text-xs text-muted-foreground">Total Expenses: ${expensesData.totalAmount.toFixed(2)}</div>
                </div>
              ) : (
                <div className="mt-1 text-xs text-muted-foreground">No expenses found for selected period</div>
              )}
            </div>

            <div>
              <Label htmlFor="hours-import" className="text-sm mb-1 block">Schedule Hours</Label>
              <div className="space-y-1">
                {scheduleHoursTimeout ? (
                  <Alert variant="destructive" className="mt-1 py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Loading schedule hours is taking longer than expected. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : isLoadingScheduleHours ? (
                  <div className="mt-1 text-xs text-muted-foreground">Loading schedule hours...</div>
                ) : scheduleHoursData ? (
                  <div className="mt-1">
                    <div className="text-xs text-muted-foreground">Total Hours: {scheduleHoursData.totalHours.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">AVG Hourly Rate: ${scheduleHoursData.payRate.toFixed(2)}</div>
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-muted-foreground">No schedule hours found for selected period</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}