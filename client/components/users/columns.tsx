"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { User } from "@/types/prismaTypes"
import { getRandomPlaceholderImage } from "@/lib/utils"

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
            <div className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
        ),
        cell: ({ row }) => {
            const fullName = row.original.fullName || ""


            const getInitials = (fullName?: string) => {
                if (!fullName) return "??"
                return `${fullName?.[0] || ""}`
            }

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={getRandomPlaceholderImage()} alt={fullName} />
                        <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
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
        accessorKey: "address",
        header: ({ column }) => (
            <div className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Address
            </div>
        ),
        cell: ({ row }) => (
            <div className=" w-fit text-center text-xs text-neutral-500">
                {row.original.address}
            </div>
        ),
    },

    {
        accessorKey: "subRole",
        header: ({ column }) => (
            <div className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Subrole
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-xs text-blue-700 bg-blue-100/50 font-medium rounded-md px-2 py-1 max-w-30 w-fit text-center">
                {row.original.subRole ?
                    row.original.subRole
                        .split('_')
                        .map((word: string) =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(' ')
                    : "None"}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <div className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-700" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Added
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
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
