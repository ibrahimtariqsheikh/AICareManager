"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/prismaTypes"

export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const firstName = row.original.firstName || ""
            const lastName = row.original.lastName || ""
            const fullName = `${firstName} ${lastName}`.trim()
            const email = row.original.email || ""

            const getInitials = (firstName?: string, lastName?: string) => {
                if (!firstName && !lastName) return "??"
                return `${firstName?.[0] || ""}${lastName?.[0] || ""}`
            }

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.profile?.avatarUrl || ""} alt={fullName} />
                        <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium text-gray-800">{fullName}</div>
                        {row.original.role === "CLIENT" && row.original.clientId && (
                            <div className="text-xs text-gray-500">ID: {row.original.clientId.substring(0, 8)}</div>
                        )}
                        {row.original.email && (
                            <div className="text-xs text-gray-500">
                                {row.original.email}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status || "Active"
            switch (status.toLowerCase()) {
                case "active":
                    return <Badge className="bg-blue-500/10 text-blue-800 hover:bg-blue-200 border-0 shadow-none">Active</Badge>
                case "inactive":
                    return <Badge className="bg-gray-500/10 text-gray-800 hover:bg-gray-200 border-0 shadow-none">Inactive</Badge>
                case "pending":
                    return <Badge className="bg-yellow-500/10 text-yellow-800 hover:bg-yellow-200 border-0 shadow-none">Pending</Badge>
                default:
                    return <Badge className="bg-blue-500/10 text-blue-800 hover:bg-blue-200 border-0 shadow-none">{status}</Badge>
            }
        },
    },
    {
        accessorKey: "subRole",
        header: "Subrole",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600">
                {row.original.subRole ? row.original.subRole.replace(/_/g, " ") : "None"}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Added
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
