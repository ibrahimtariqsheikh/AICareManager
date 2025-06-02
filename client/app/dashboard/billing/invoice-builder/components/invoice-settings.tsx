"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setInvoiceData, setInvoiceNumber } from "@/state/slices/invoiceSlice"
import { useGetCurrentInvoiceNumberQuery, useGetExpensesByDateRangeQuery, useGetScheduleHoursByDateRangeQuery } from "@/state/api"
import { MyCustomDateRange } from "../../components/my-custom-date-range"
import { CustomInput } from "@/components/ui/custom-input"
import { skipToken } from "@reduxjs/toolkit/query"
import type { InvoiceItem } from "../types"

export function InvoiceSettings() {
  const invoiceData = useAppSelector((state) => state.invoice.invoiceData)
  const selectedDateRange = useAppSelector((state) => state.invoice.selectedDateRange)
  const { data: invoiceNumberData } = useGetCurrentInvoiceNumberQuery()
  const dispatch = useAppDispatch()

  const { data: expenses, isLoading: isExpensesLoading } = useGetExpensesByDateRangeQuery(
    selectedDateRange?.from && selectedDateRange?.to
      ? {
        startDate: selectedDateRange.from.toISOString(),
        endDate: selectedDateRange.to.toISOString()
      }
      : skipToken
  )

  const { data: scheduleHours, isLoading: isScheduleHoursLoading } = useGetScheduleHoursByDateRangeQuery(
    selectedDateRange?.from && selectedDateRange?.to
      ? {
        startDate: selectedDateRange.from.toISOString(),
        endDate: selectedDateRange.to.toISOString()
      }
      : skipToken
  )

    ("scheduleHours", scheduleHours)

  const getFormattedInvoiceNumber = () => {
    if (invoiceNumberData) {
      const invoiceNumberString = (invoiceNumberData.invoiceNumber + 1).toString()
      const formattedInvoiceNumber = "ACM-" + invoiceNumberString + "-" + format(new Date(), "yyyy")
        ("formattedInvoiceNumber", { formattedInvoiceNumber })
      dispatch(setInvoiceNumber(formattedInvoiceNumber))
      return formattedInvoiceNumber
    }
    return ""
  }

  // Add expenses and schedule hours as predefined items
  useEffect(() => {
    ("Full scheduleHours response:", scheduleHours)
    // Create new predefined items array
    const predefinedItems: InvoiceItem[] = []

    // Add expenses if available
    if (expenses && expenses.totalAmount > 0) {
      predefinedItems.push({
        id: `expenses-${Date.now()}`,
        description: `Expenses (${format(selectedDateRange?.from || new Date(), "MMM d")} - ${format(selectedDateRange?.to || new Date(), "MMM d")})`,
        quantity: 1,
        rate: expenses.totalAmount,
        amount: expenses.totalAmount,
        serviceType: "EXPENSES",
        careWorkerId: "",
      })
    }

    // Add schedule hours if available
    ("Schedule Hours Data:", scheduleHours)
    if (scheduleHours && typeof scheduleHours.totalHours === 'number') {
      const hours = scheduleHours.totalHours
      const rate = Math.floor(scheduleHours.payRate || 0)
      const amount = hours * rate

        ("Creating Schedule Hours Item:", {
          hours,
          rate,
          amount,
          rawData: scheduleHours
        })

      predefinedItems.push({
        id: `hours-${Date.now()}`,
        description: `Schedule Hours (${format(selectedDateRange?.from || new Date(), "MMM d")} - ${format(selectedDateRange?.to || new Date(), "MMM d")})`,
        quantity: hours,
        rate: rate,
        amount: amount,
        serviceType: "SCHEDULE_HOURS",
        careWorkerId: "",
      })
    } else {
      ("Schedule Hours not added because:", {
        hasScheduleHours: !!scheduleHours,
        totalHours: scheduleHours?.totalHours,
        typeOfTotalHours: typeof scheduleHours?.totalHours
      })
    }

    ("Final Predefined Items:", predefinedItems)
    // Update Redux state with predefined items
    if (predefinedItems.length > 0) {
      dispatch(setInvoiceData({
        ...invoiceData,
        predefinedItems,
        // Convert dates to ISO strings
        issueDate: invoiceData?.issueDate ? new Date(invoiceData.issueDate).toISOString() : new Date().toISOString(),
        dueDate: invoiceData?.dueDate ? new Date(invoiceData.dueDate).toISOString() : new Date().toISOString()
      }))
    }
  }, [expenses, scheduleHours, selectedDateRange, dispatch, invoiceData])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <CustomInput
            id="invoiceNumber"
            value={getFormattedInvoiceNumber()}
            disabled
            variant="default"
            inputSize="default"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
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

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
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

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="taxEnabled"
              checked={invoiceData?.taxEnabled ?? false}
              onCheckedChange={(checked: boolean) =>
                dispatch(setInvoiceData({ ...invoiceData, taxEnabled: checked }))
              }
            />
            <Label htmlFor="taxEnabled">Enable Tax</Label>
          </div>
        </div>

        {invoiceData?.taxEnabled && (
          <div className="space-y-4 border rounded-md p-4 bg-muted/10">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <CustomInput
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 20"
                value={invoiceData?.taxRate?.toString()}
                onChange={(value) =>
                  dispatch(setInvoiceData({ ...invoiceData, taxRate: Number.parseFloat(value) || 0 }))
                }
                variant="default"
                inputSize="default"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expenses" className="mb-2 block">Expenses</Label>
            {isExpensesLoading ? (
              <div className="mt-2 text-xs text-muted-foreground">Loading expenses...</div>
            ) : expenses ? (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground">Total Expenses: ${expenses.totalAmount.toFixed(2)}</div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-muted-foreground">No expenses found for selected period</div>
            )}
          </div>

          <div>
            <Label htmlFor="hours-import" className="mb-2 block">Schedule Hours</Label>
            <div className="space-y-2">
              {isScheduleHoursLoading ? (
                <div className="mt-2 text-xs text-muted-foreground">Loading schedule hours...</div>
              ) : scheduleHours ? (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Total Hours: {scheduleHours.totalHours.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">AVG Hourly Rate: ${scheduleHours.payRate.toFixed(2)}</div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-muted-foreground">No schedule hours found for selected period</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
