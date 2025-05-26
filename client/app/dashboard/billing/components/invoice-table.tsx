"use client"

import { useState, useEffect } from "react"
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
import { format } from "date-fns"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import { DateRange } from "react-day-picker"


const mockClients = [
    { id: "client1", name: "John Doe", avatar: "/placeholder.svg" },
    { id: "client2", name: "Jane Smith", avatar: "/placeholder.svg" },
    { id: "client3", name: "Bob Johnson", avatar: "/placeholder.svg" },
]

interface Invoice {
    id: string
    clientId: string
    amount: number
    description: string
    dueDate: string
    status: string
    paymentMethod: string
    avatar: string | undefined
}

interface InvoiceTableProps {
    date: DateRange | undefined
}

export function InvoiceTable({ date }: InvoiceTableProps): React.JSX.Element {
    const [sortField, setSortField] = useState<string>("id")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: "INV-2024-001",
            avatar: getRandomPlaceholderImage(),
            clientId: "client1",
            amount: 1250.00,
            description: "Home Care Services - January 2024",
            dueDate: "2024-02-15",
            status: "SENT",
            paymentMethod: "Bank Transfer"
        }
    ])

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch("/api/invoices")
                if (!response.ok) {
                    throw new Error("Failed to fetch invoices")
                }
                const data = await response.json()

                // Filter invoices based on date range if provided
                let filteredData = data
                if (date?.from && date?.to) {
                    filteredData = data.filter((invoice: Invoice) => {
                        const invoiceDate = new Date(invoice.dueDate)
                        return invoiceDate >= date.from! && invoiceDate <= date.to!
                    })
                }

                setInvoices(filteredData)
            } catch (error) {
                console.error("Error fetching invoices:", error)
            }
        }

        fetchInvoices()
    }, [date]) // Add date as a dependency

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Open
                    </Badge>
                )
            case "SENT":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Sent
                    </Badge>
                )
            case "PARTIALLY_PAID":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Partially Paid
                    </Badge>
                )
            case "PAID":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                    </Badge>
                )
            case "OVERDUE":
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
                    <TableRow className="border-b border-border bg-muted/50">
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("id")}>
                            <div className="flex items-center">
                                Invoice ID
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("status")}>
                            <div className="flex items-center">
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("client")}>
                            <div className="flex items-center">
                                Client
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("amount")}>
                            <div className="flex items-center">
                                Amount
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("dueDate")}>
                            <div className="flex items-center">
                                Due Date
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("paymentMethod")}>
                            <div className="flex items-center">
                                Pay Method
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                        </TableHead>
                        <TableHead className="w-12 py-2 px-3"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => {
                        const client = mockClients.find(c => c.id === invoice.clientId)
                        return (
                            <TableRow key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                <TableCell className="py-2 px-3">
                                    <div className="font-medium">{invoice.id}</div>
                                    <div className="text-sm text-muted-foreground">{invoice.description}</div>
                                </TableCell>
                                <TableCell className="py-2 px-3">{getStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="py-2 px-3">
                                    {client && (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={invoice.avatar}
                                                    alt={client.name}
                                                />
                                                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{client.name}</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="py-2 px-3 font-medium">${invoice.amount.toFixed(2)}</TableCell>
                                <TableCell className="py-2 px-3">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                                <TableCell className="py-2 px-3">{invoice.paymentMethod}</TableCell>
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
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
