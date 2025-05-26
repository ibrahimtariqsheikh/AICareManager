"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, Calculator, Paperclip, MoreHorizontal, Download, Send, Eye, ArrowUpDown } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"

interface PayrollTableProps {
    date: DateRange | undefined
}

const mockPayrollEntries = [
    {
        id: "PAY-001",
        employee: "Sarah Wilson",
        type: "Careworker",
        hoursWorked: 40,
        hourlyRate: 25.00,
        grossPay: 1000.00,
        taxDeductions: 200.00,
        netPay: 800.00,
        expenses: 50.00,
        status: "Processed",
        payPeriod: "Jan 1-15, 2024",
        avatar: getRandomPlaceholderImage()
    },
    {
        id: "PAY-002",
        employee: "Mike Johnson",
        type: "Office Staff",
        hoursWorked: 0,
        hourlyRate: 0,
        grossPay: 3000.00,
        taxDeductions: 600.00,
        netPay: 2400.00,
        expenses: 0,
        status: "Pending",
        payPeriod: "Jan 1-15, 2024",
        avatar: getRandomPlaceholderImage()
    },
    {
        id: "PAY-003",
        employee: "Lisa Chen",
        type: "Careworker",
        hoursWorked: 35,
        hourlyRate: 28.00,
        grossPay: 980.00,
        taxDeductions: 196.00,
        netPay: 784.00,
        expenses: 75.00,
        status: "Processed",
        payPeriod: "Jan 1-15, 2024",
        avatar: getRandomPlaceholderImage()
    }
]

interface PayrollEntry {
    id: string
    employee: string
    type: string
    hoursWorked: number
    hourlyRate: number
    grossPay: number
    taxDeductions: number
    netPay: number
    expenses: number
    status: string
    payPeriod: string
    avatar?: string
}

export function PayrollTable({ date }: PayrollTableProps) {
    const [showNewPayrollDialog, setShowNewPayrollDialog] = useState(false)
    const [sortField, setSortField] = useState<string>("id")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>(mockPayrollEntries)

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Processed":
                return "bg-green-50 text-green-700 border-green-200"
            case "Pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-200"
            case "Draft":
                return "bg-gray-50 text-gray-700 border-gray-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-muted/50">
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("id")}>
                                <div className="flex items-center">
                                    ID
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("employee")}>
                                <div className="flex items-center">
                                    Employee
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("type")}>
                                <div className="flex items-center">
                                    Type
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("grossPay")}>
                                <div className="flex items-center">
                                    Gross Pay
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("netPay")}>
                                <div className="flex items-center">
                                    Net Pay
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("status")}>
                                <div className="flex items-center">
                                    Status
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="w-12 py-2 px-3"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollEntries.map((entry: PayrollEntry) => (
                            <TableRow key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                <TableCell className="py-2 px-3">
                                    <div className="font-medium">{entry.id}</div>
                                    <div className="text-sm text-muted-foreground">{entry.payPeriod}</div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={entry.avatar}
                                                alt={entry.employee}
                                            />
                                            <AvatarFallback>{entry.employee.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{entry.employee}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">{entry.type}</TableCell>
                                <TableCell className="py-2 px-3 font-medium">${entry.grossPay.toFixed(2)}</TableCell>
                                <TableCell className="py-2 px-3 font-medium">${entry.netPay.toFixed(2)}</TableCell>
                                <TableCell className="py-2 px-3">
                                    <Badge variant="outline" className={getStatusColor(entry.status)}>
                                        {entry.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Eye className="h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Edit className="h-4 w-4" /> Edit Payroll
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Calculator className="h-4 w-4" /> Calculate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Download className="h-4 w-4" /> Download PDF
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                <Trash2 className="h-4 w-4" /> Delete Payroll
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function NewPayrollForm({ onClose }: { onClose: () => void }) {
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
                    <Input id="employee" placeholder="Enter employee name" />
                </div>
                <div>
                    <Label htmlFor="employee-type">Employee Type</Label>
                    <Select value={employeeType} onValueChange={setEmployeeType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select employee type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="careworker">Careworker</SelectItem>
                            <SelectItem value="office-staff">Office Staff</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {employeeType === "careworker" && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="hours">Hours Worked</Label>
                        <Input
                            id="hours"
                            type="number"
                            placeholder="40"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rate">Hourly Rate ($)</Label>
                        <Input
                            id="rate"
                            type="number"
                            placeholder="25.00"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {employeeType === "office-staff" && (
                <div>
                    <Label htmlFor="salary">Fixed Salary ($)</Label>
                    <Input
                        id="salary"
                        type="number"
                        placeholder="3000.00"
                        value={fixedSalary}
                        onChange={(e) => setFixedSalary(e.target.value)}
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                        id="tax-rate"
                        type="number"
                        placeholder="20"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="expenses">Expenses ($)</Label>
                    <Input id="expenses" type="number" placeholder="0.00" />
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
                    <Input type="file" multiple />
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