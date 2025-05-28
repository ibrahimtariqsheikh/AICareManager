"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, Receipt, MoreHorizontal, Download, Eye, ArrowUpDown } from 'lucide-react'
import { DateRange } from "react-day-picker"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { useAppSelector } from "@/state/redux"
import { useGetAgencyExpensesQuery } from "@/state/api"

interface ExpenseEntry {
    id: string
    expenseNumber: number
    amount: number
    category: string
    description: string
    date: string
    type: string
    associatedEntity: string
    user: {
        id: string
        fullName: string
        email: string
        phoneNumber: string
    }
}

interface ExpensesTableProps {
    date: DateRange | undefined
}

export function ExpensesTable({ date }: ExpensesTableProps) {
    const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false)
    const [sortField, setSortField] = useState<string>("id")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const agencyId = useAppSelector(state => state.user.user.userInfo?.agencyId)
    const { data: expenses, isLoading: isExpensesLoading } = useGetAgencyExpensesQuery(agencyId || "")

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const getStatusColor = (type: string) => {
        switch (type) {
            case "COMPANY":
                return "bg-green-50 text-green-700 border-green-200"
            case "PERSONAL":
                return "bg-yellow-50 text-yellow-700 border-yellow-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    if (isExpensesLoading) {
        return <div>Loading expenses...</div>
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-muted/50">
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("expenseNumber")}>
                                <div className="flex items-center">
                                    ID
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("user.fullName")}>
                                <div className="flex items-center">
                                    Employee
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("category")}>
                                <div className="flex items-center">
                                    Category
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("amount")}>
                                <div className="flex items-center">
                                    Amount
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("date")}>
                                <div className="flex items-center">
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("type")}>
                                <div className="flex items-center">
                                    Type
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="w-12 py-2 px-3"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses?.map((entry: ExpenseEntry) => (
                            <TableRow key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                <TableCell className="py-2 px-3">
                                    <div className="font-medium">EXP-{entry.expenseNumber}</div>
                                </TableCell>
                                <TableCell className="py-2 px-3">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={getRandomPlaceholderImage()} alt={entry.user.fullName} />
                                            <AvatarFallback>{entry.user.fullName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{entry.user.fullName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-2 px-3">{entry.category}</TableCell>
                                <TableCell className="py-2 px-3 font-medium">${entry.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-2 px-3">{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell className="py-2 px-3">
                                    <Badge variant="outline" className={getStatusColor(entry.type)}>
                                        {entry.type}
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
                                                <Edit className="h-4 w-4" /> Edit Expense
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Receipt className="h-4 w-4" /> View Receipt
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Download className="h-4 w-4" /> Download Receipt
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                                <Trash2 className="h-4 w-4" /> Delete Expense
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

function NewExpenseForm({ onClose }: { onClose: () => void }) {
    const [employee, setEmployee] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [receipt, setReceipt] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select value={employee} onValueChange={setEmployee}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sarah">Sarah Wilson</SelectItem>
                            <SelectItem value="mike">Mike Johnson</SelectItem>
                            <SelectItem value="lisa">Lisa Chen</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="office">Office Supplies</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter expense description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="receipt">Receipt</Label>
                <Input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    Create Expense
                </Button>
            </div>
        </form>
    )
} 