"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Paperclip } from "lucide-react"

interface NewPayrollFormProps {
    onClose: () => void
}

export function NewPayrollForm({ onClose }: NewPayrollFormProps) {
    const [employeeType, setEmployeeType] = useState("")
    const [hoursWorked, setHoursWorked] = useState("")
    const [hourlyRate, setHourlyRate] = useState("")
    const [fixedSalary, setFixedSalary] = useState("")
    const [taxRate, setTaxRate] = useState("20")

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

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="employee">Employee Name</Label>
                    <CustomInput id="employee" placeholder="Enter employee name" />
                </div>
                <div>
                    <Label htmlFor="employee-type">Employee Type</Label>
                    <CustomSelect
                        value={employeeType}
                        onChange={setEmployeeType}
                        placeholder="Select employee type"
                        options={[
                            { value: "careworker", label: "Careworker" },
                            { value: "office-staff", label: "Office Staff" }
                        ]}
                    />
                </div>
            </div>

            {employeeType === "careworker" && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="hours">Hours Worked</Label>
                        <CustomInput
                            id="hours"
                            type="number"
                            placeholder="40"
                            value={hoursWorked}
                            onChange={setHoursWorked}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rate">Hourly Rate ($)</Label>
                        <CustomInput
                            id="rate"
                            type="number"
                            placeholder="25.00"
                            value={hourlyRate}
                            onChange={setHourlyRate}
                        />
                    </div>
                </div>
            )}

            {employeeType === "office-staff" && (
                <div>
                    <Label htmlFor="salary">Fixed Salary ($)</Label>
                    <CustomInput
                        id="salary"
                        type="number"
                        placeholder="3000.00"
                        value={fixedSalary}
                        onChange={setFixedSalary}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <CustomInput
                        id="tax-rate"
                        type="number"
                        placeholder="20"
                        value={taxRate}
                        onChange={setTaxRate}
                    />
                </div>
                <div>
                    <Label htmlFor="expenses">Expenses ($)</Label>
                    <CustomInput id="expenses" type="number" placeholder="0.00" />
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">Payroll Calculation</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Gross Pay:</span>
                        <div className="font-semibold">${calculateGrossPay().toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Tax Deductions:</span>
                        <div className="font-semibold">${calculateTaxDeductions().toFixed(2)}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Net Pay:</span>
                        <div className="font-semibold text-green-600">${calculateNetPay().toFixed(2)}</div>
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="expenses-attachment">Attach Expenses</Label>
                <div className="flex gap-2 mt-1">
                    <CustomInput type="file" multiple />
                    <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={onClose}>
                    Save Payroll Entry
                </Button>
            </div>
        </div>
    )
} 