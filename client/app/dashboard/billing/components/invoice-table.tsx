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
import { format } from "date-fns"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { useGetAgencyInvoicesQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { Invoice, InvoicePaymentMethod, InvoiceStatus } from "@/types/prismaTypes"


interface InvoiceTableProps {
    date: DateRange | undefined
}

export function InvoiceTable({ date }: InvoiceTableProps): React.JSX.Element {
    const [sortField, setSortField] = useState<string>("id")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    const agencyId = useAppSelector(state => state.user.user.userInfo?.agencyId)

    const { data: invoices } = useGetAgencyInvoicesQuery(agencyId || "")

    const clients = useAppSelector(state => state.user.clients)

    const getClientNameFromId = (clientId: string) => {
        const client = clients.find(c => c.id === clientId)
        return client?.fullName
    }



    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-50 text-yellow-700 border-yellow-200"
            case "PAID":
                return "bg-green-50 text-green-700 border-green-200"
            case "OVERDUE":
                return "bg-red-50 text-red-700 border-red-200"
            case "CANCELLED":
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }


    const formatPaymentMethod = (paymentMethod: InvoicePaymentMethod) => {
        switch (paymentMethod) {
            case "CASH":
                return "Cash"
            case "CHEQUE":
                return "Cheque"
            case "CARD":
                return "Card"
            case "BANK_TRANSFER":
                return "Bank Transfer"
            case "OTHER":
                return "Other"
        }
    }


    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    // Get status badge
    const getStatusBadge = (status: InvoiceStatus) => {
        return (
            <Badge variant="outline" className={getStatusColor(status)}>
                {status}
            </Badge>
        )
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
                    {!invoices || invoices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No invoices found
                            </TableCell>
                        </TableRow>
                    ) : (
                        invoices?.map((invoice: Invoice) => {

                            return (
                                <TableRow key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                    <TableCell className="py-2 px-3">
                                        <div className="font-medium">INV-{invoice.invoiceNumber}</div>
                                        <div className="text-sm text-muted-foreground">{invoice.description}</div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        {invoice.clientId && (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={getRandomPlaceholderImage()}
                                                        alt={getClientNameFromId(invoice.clientId) || ""}
                                                    />
                                                    <AvatarFallback>{getClientNameFromId(invoice.clientId).charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{getClientNameFromId(invoice.clientId)}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2 px-3 font-medium">${invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell className="py-2 px-3">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="py-2 px-3">{formatPaymentMethod(invoice.paymentMethod)}</TableCell>
                                    <TableCell className="py-2 px-3">{getStatusBadge(invoice.status)}</TableCell>
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
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
