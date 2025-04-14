"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Download, Edit, Eye, MoreHorizontal, Send, Trash } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

// Mock data for invoices
const mockInvoices = [
    {
        id: "INV-001",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 1400,
        status: "open",
        careRecipient: {
            id: "cr-001",
            name: "Huang, Lian",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-001",
            name: "Huang, Jonathan",
            initial: "J",
        },
        paymentMethod: "ACH",
    },
    {
        id: "INV-002",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 1200,
        status: "open",
        careRecipient: {
            id: "cr-002",
            name: "Brief, Richard",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-002",
            name: "Brief, Marcus",
            initial: "M",
        },
        paymentMethod: "Credit Card",
    },
    {
        id: "INV-003",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 1400,
        status: "open",
        careRecipient: {
            id: "cr-003",
            name: "Dibbert, Leola",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-003",
            name: "Dibbert, Leola",
            initial: "L",
        },
        paymentMethod: "ACH",
    },
    {
        id: "INV-004",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 800,
        status: "sent",
        careRecipient: {
            id: "cr-004",
            name: "Donnelly, Dejah",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-004",
            name: "Genworth LTC",
            initial: "G",
        },
        paymentMethod: "Paper Check",
    },
    {
        id: "INV-005",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 300,
        status: "sent",
        careRecipient: {
            id: "cr-005",
            name: "Ernser, Conrad",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-005",
            name: "Hancock LTC",
            initial: "H",
        },
        paymentMethod: "Paper Check",
    },
    {
        id: "INV-006",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 1100,
        status: "partially_paid",
        careRecipient: {
            id: "cr-006",
            name: "Grant, Arvilla",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-006",
            name: "Grant, Arvilla",
            initial: "A",
        },
        paymentMethod: "ACH",
    },
    {
        id: "INV-007",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 500,
        status: "partially_paid",
        careRecipient: {
            id: "cr-007",
            name: "Greeves, Bob",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-007",
            name: "Greeves, John",
            initial: "J",
        },
        paymentMethod: "ACH",
    },
    {
        id: "INV-008",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 800,
        status: "paid",
        careRecipient: {
            id: "cr-008",
            name: "Gutkowski, Sophia",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-008",
            name: "Hancock LTC",
            initial: "H",
        },
        paymentMethod: "Paper Check",
    },
    {
        id: "INV-009",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 900,
        status: "paid",
        careRecipient: {
            id: "cr-009",
            name: "Hagenes, Yolanda",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-009",
            name: "Hagenes, Sean",
            initial: "S",
        },
        paymentMethod: "Credit Card",
    },
    {
        id: "INV-010",
        billingPeriod: { from: new Date(2025, 3, 11), to: new Date(2025, 3, 17) },
        amount: 800,
        status: "paid",
        careRecipient: {
            id: "cr-010",
            name: "Hand, Paris",
            avatar: "/placeholder.svg?height=32&width=32",
        },
        payer: {
            id: "p-010",
            name: "Hand, Mark",
            initial: "M",
        },
        paymentMethod: "Wire Transfer",
    },
]

interface InvoiceTableProps {
    date?: DateRange | undefined
    filters?: any
}

export function InvoiceTable({ date, filters }: InvoiceTableProps) {
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
    const [sortColumn, setSortColumn] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    // Handle sort
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    // Handle select all
    const handleSelectAll = () => {
        if (selectedInvoices.length === mockInvoices.length) {
            setSelectedInvoices([])
        } else {
            setSelectedInvoices(mockInvoices.map((invoice) => invoice.id))
        }
    }

    // Handle select invoice
    const handleSelectInvoice = (id: string) => {
        if (selectedInvoices.includes(id)) {
            setSelectedInvoices(selectedInvoices.filter((invoiceId) => invoiceId !== id))
        } else {
            setSelectedInvoices([...selectedInvoices, id])
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Open
                    </Badge>
                )
            case "sent":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Sent
                    </Badge>
                )
            case "partially_paid":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Partially Paid
                    </Badge>
                )
            case "paid":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                    </Badge>
                )
            case "overdue":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Overdue
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={selectedInvoices.length === mockInvoices.length && mockInvoices.length > 0}
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all invoices"
                            />
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("billingPeriod")}>
                            <div className="flex items-center">
                                Billing Period
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                            <div className="flex items-center">
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("careRecipient")}>
                            <div className="flex items-center">
                                Care Recipient
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("payer")}>
                            <div className="flex items-center">
                                Payer
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                            <div className="flex items-center">
                                Amount
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                            <div className="flex items-center">
                                Pay Method
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className={selectedInvoices.includes(invoice.id) ? "bg-muted/50" : ""}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedInvoices.includes(invoice.id)}
                                    onCheckedChange={() => handleSelectInvoice(invoice.id)}
                                    aria-label={`Select invoice ${invoice.id}`}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">
                                    {format(invoice.billingPeriod.from, "M/d/yyyy")} - {format(invoice.billingPeriod.to, "M/d/yyyy")}
                                </div>
                                <div className="text-sm text-muted-foreground">{invoice.id}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={invoice.careRecipient.avatar || "/placeholder.svg"}
                                            alt={invoice.careRecipient.name}
                                        />
                                        <AvatarFallback>{invoice.careRecipient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{invoice.careRecipient.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                                        {invoice.payer.initial}
                                    </div>
                                    <span>{invoice.payer.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell>
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
                                            <Edit className="h-4 w-4" /> Edit Invoice
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <Send className="h-4 w-4" /> Send Invoice
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2">
                                            <Download className="h-4 w-4" /> Download PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                            <Trash className="h-4 w-4" /> Delete Invoice
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
