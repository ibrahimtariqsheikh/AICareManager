"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { skipToken } from "@reduxjs/toolkit/query"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { addPayroll } from "@/state/slices/payrollSlice"
import { MyCustomDateRange } from "./my-custom-date-range"
import { useCreatePayrollMutation, useGetExpensesByDateRangeQuery, useGetScheduleHoursByDateRangeQuery } from "@/state/api"
import { Payroll } from "@/types/billing"

interface NewPayrollFormProps {
    onClose: () => void
}

export function NewPayrollForm({ onClose }: NewPayrollFormProps) {
    const dispatch = useAppDispatch()
    const [employeeType, setEmployeeType] = useState("")
    const [selectedEmployee, setSelectedEmployee] = useState("")
    const [hoursWorked, setHoursWorked] = useState("")
    const [hourlyRate, setHourlyRate] = useState("")
    const [fixedSalary, setFixedSalary] = useState("")
    const [taxRate, setTaxRate] = useState("20")
    const [expensesDateRange, setExpensesDateRange] = useState<{ from: Date; to: Date } | undefined>()
    const [hoursDateRange, setHoursDateRange] = useState<{ from: Date; to: Date } | undefined>()

    const [createPayroll, { isLoading: isCreatePayrollLoading }] = useCreatePayrollMutation()

    const { data: expenses, isLoading: isExpensesLoading } = useGetExpensesByDateRangeQuery(
        expensesDateRange?.from && expensesDateRange?.to
            ? {
                startDate: expensesDateRange.from.toISOString(),
                endDate: expensesDateRange.to.toISOString()
            }
            : skipToken
    )

    const { data: scheduleHours, isLoading: isScheduleHoursLoading } = useGetScheduleHoursByDateRangeQuery(
        hoursDateRange?.from && hoursDateRange?.to
            ? {
                startDate: hoursDateRange.from.toISOString(),
                endDate: hoursDateRange.to.toISOString()
            }
            : skipToken
    )

    // Update hours and rate when schedule data is loaded
    useEffect(() => {
        if (scheduleHours) {
            setHoursWorked(scheduleHours.totalHours.toString())
            setHourlyRate(scheduleHours.payRate.toString())
        }
    }, [scheduleHours])



    const clients = useAppSelector(state => state.user.clients)
    const careworkers = useAppSelector(state => state.user.careWorkers)
    const officeStaff = useAppSelector(state => state.user.officeStaff)
    const agencyId = useAppSelector(state => state.user.user.userInfo?.agencyId) || ""

    const calculateGrossPay = () => {
        if (employeeType === "office-staff") {
            return parseFloat(fixedSalary) || 0
        } else {
            return (parseFloat(hoursWorked) || 0) * (parseFloat(hourlyRate) || 0)
        }
    }

    const calculateTaxDeductions = () => {
        const gross = calculateGrossPay()
        return gross * (parseFloat(taxRate) / 100)
    }

    const calculateNetPay = () => {
        return calculateGrossPay() - calculateTaxDeductions()
    }

    const handleSubmit = async () => {
        if (!selectedEmployee || !expensesDateRange || !hoursDateRange) {
            return
        }

        try {
            const payrollData: Omit<Payroll, 'id'> = {
                userId: selectedEmployee,
                agencyId,
                expensesFromDate: expensesDateRange.from,
                expensesToDate: expensesDateRange.to,
                scheduleFromDate: hoursDateRange.from,
                scheduleToDate: hoursDateRange.to,
                calculatedScheduleHours: parseFloat(hoursWorked) || 0,
                calculatedExpenses: expenses?.totalAmount || 0,
                totalEarnings: calculateGrossPay(),
                totalDeductions: calculateTaxDeductions(),
                netPay: calculateNetPay(),
                taxRate: parseFloat(taxRate)
            }

            const response = await createPayroll(payrollData).unwrap()


            // Extract the payroll data from the nested response
            const payroll = response.payroll

            if (payroll && payroll.id) {
                dispatch(addPayroll(payroll))
                onClose()
            } else {
                console.error('Invalid payroll data received from server:', response)
            }
        } catch (error) {
            console.error('Failed to create payroll:', error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="employee-type" className="mb-2 block">Employee Type</Label>
                    <CustomSelect
                        value={employeeType}
                        onChange={setEmployeeType}
                        placeholder="Select employee type"
                        options={[
                            { value: "client", label: "Client" },
                            { value: "careworker", label: "Careworker" },
                            { value: "office-staff", label: "Office Staff" }
                        ]}
                    />
                </div>
                <div>
                    <Label htmlFor="employee" className="mb-2 block">Employee</Label>
                    <CustomSelect
                        value={selectedEmployee}
                        onChange={setSelectedEmployee}
                        placeholder="Select employee"
                        options={
                            employeeType === "client"
                                ? clients.map(client => ({ value: client.id, label: client.fullName }))
                                : employeeType === "careworker"
                                    ? careworkers.map(worker => ({ value: worker.id, label: worker.fullName }))
                                    : employeeType === "office-staff"
                                        ? officeStaff.map(staff => ({ value: staff.id, label: staff.fullName }))
                                        : []
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="expenses" className="mb-2 block">Expenses Date Range</Label>
                    <MyCustomDateRange
                        onRangeChange={(range) => setExpensesDateRange(range)}
                        className="w-full"
                        placeholder="Select expenses date range"
                    />
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

                {employeeType === "careworker" && (
                    <div>
                        <Label htmlFor="hours-import" className="mb-2 block">Import Hours from Schedule</Label>
                        <div className="space-y-2">
                            <MyCustomDateRange
                                onRangeChange={(range) => setHoursDateRange(range)}
                                className="w-full"
                                placeholder="Select hours date range"
                            />
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
                )}
            </div>

            {employeeType === "office-staff" && (
                <div>
                    <Label htmlFor="salary" className="mb-2 block">Fixed Salary ($)</Label>
                    <CustomInput
                        id="salary"
                        type="number"
                        placeholder="3000.00"
                        value={fixedSalary}
                        onChange={setFixedSalary}
                    />
                </div>
            )}

            <div>
                <Label htmlFor="tax-rate" className="mb-2 block">Tax Rate (%)</Label>
                <CustomInput
                    id="tax-rate"
                    type="number"
                    placeholder="20"
                    value={taxRate}
                    onChange={setTaxRate}
                />
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-4">Payroll Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Total Earnings:</span>
                        <div className="font-semibold">${calculateGrossPay().toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Total Tax:</span>
                        <div className="font-semibold">${calculateTaxDeductions().toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Total Pay:</span>
                        <div className="font-semibold text-green-600">${calculateNetPay().toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isCreatePayrollLoading || !selectedEmployee || !expensesDateRange || !hoursDateRange}
                >
                    {isCreatePayrollLoading ? 'Saving...' : 'Save Payroll Entry'}
                </Button>
            </div>
        </div>
    )
} 