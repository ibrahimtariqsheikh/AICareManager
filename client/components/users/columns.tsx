"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
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
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDeleteUserMutation, useGetAgencyUsersQuery, useGetUserQuery } from "@/state/api"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { removeUser } from "@/state/slices/userSlice"

function UserActions({ user }: { user: User }) {
    const router = useRouter()
    const { theme } = useTheme()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteUser] = useDeleteUserMutation()
    const dispatch = useAppDispatch()
    const selectedUserType = useAppSelector((state) => state.user.activeUserType)
    const { data: userData } = useGetUserQuery()
    const { refetch: refetchUsers } = useGetAgencyUsersQuery(userData?.userInfo?.agencyId || "")

    const handleDeleteUser = async () => {
        setIsDeleting(true)
        try {
            const response = await deleteUser(user.id)
            if ('error' in response) {
                const error = response.error as { status?: number }
                if (error.status === 404) {
                    toast.error("User not found")
                    return
                }
            }
            dispatch(removeUser({ id: user.id, selectedUserType: selectedUserType }))
            await refetchUsers()
            toast.success(`${user.fullName} has been deleted`)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Failed to delete user")
            console.error("Error deleting user:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const activeUserType = useAppSelector((state) => state.user.activeUserType)

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`h-8 w-8 p-0 ${theme === "dark" ? "text-gray-200 hover:text-gray-100" : ""}`}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={theme === "dark" ? "bg-zinc-900 border-zinc-700" : ""}>
                    <DropdownMenuLabel className={theme === "dark" ? "text-gray-200" : ""}>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className={theme === "dark" ? "bg-zinc-700" : ""} />
                    <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
                        className={theme === "dark" ? "text-gray-200 hover:bg-zinc-800" : ""}
                    >
                        Edit {activeUserType === "CLIENT" ? "Client" : activeUserType === "OFFICE_STAFF" ? "Staff" : activeUserType === "CARE_WORKER" ? "Care Worker" : "User"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className={theme === "dark" ? "text-gray-200 hover:bg-zinc-800" : ""}
                    >
                        Delete {activeUserType === "CLIENT" ? "Client" : activeUserType === "OFFICE_STAFF" ? "Staff" : activeUserType === "CARE_WORKER" ? "Care Worker" : "User"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className={theme === "dark" ? "bg-zinc-900 border-zinc-700" : ""}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={theme === "dark" ? "text-gray-200" : ""}>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className={theme === "dark" ? "text-gray-400" : ""}>
                            This action cannot be undone. This will permanently delete the user
                            and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={theme === "dark" ? "bg-zinc-800 text-gray-200 hover:bg-zinc-700" : ""}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className={theme === "dark" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${theme === "dark" ? "text-gray-400" : ""}`} />
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const fullName = row.original.fullName || ""
            const { theme } = useTheme()

            const getInitials = (fullName?: string) => {
                if (!fullName) return "??"
                return `${fullName?.[0] || ""}`
            }

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.profile?.avatarUrl || getRandomPlaceholderImage()} />
                        <AvatarFallback className={`${theme === "dark" ? "bg-zinc-800" : "bg-neutral-100"}`}>
                            {getInitials(fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                            {fullName || "Unknown"}
                        </span>
                        <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            {row.original.email}
                        </span>
                    </div>
                </div>
            )
        },
        enableSorting: true,
        filterFn: "includesString",
    },
    {
        accessorKey: "email",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${theme === "dark" ? "text-gray-400" : ""}`} />
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const { theme } = useTheme()
            return <div className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{row.original.email}</div>
        },
        enableSorting: true,
        filterFn: "includesString",
    },
    {
        accessorKey: "role",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Role
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${theme === "dark" ? "text-gray-400" : ""}`} />
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`text-xs font-medium rounded-md px-1.5 py-0.5 max-w-30 w-fit text-center ${theme === "dark"
                    ? "text-blue-300 bg-blue-900/50"
                    : "text-blue-700 bg-blue-100/50"
                    }`}>
                    {row.original.role}
                </div>
            )
        },
        enableSorting: true,
        filterFn: "includesString",
    },
    {
        accessorKey: "address",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Address
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`w-fit text-center text-xs ${theme === "dark" ? "text-gray-400" : "text-neutral-500"}`}>
                    {row.original.address || "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "subRole",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Subrole
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`text-xs font-medium rounded-md px-2 py-1 max-w-30 w-fit text-center ${theme === "dark"
                    ? "text-blue-300 bg-blue-900/50"
                    : "text-blue-700 bg-blue-100/50"
                    }`}>
                    {row.original.subRole ?
                        row.original.subRole
                            .split('_')
                            .map((word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            )
                            .join(' ')
                        : "None"}
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }: { column: any }) => {
            const { theme } = useTheme()
            return (
                <div className={`flex items-center gap-2 cursor-pointer text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-neutral-700"}`} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Added
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${theme === "dark" ? "text-gray-400" : ""}`} />
                </div>
            )
        },
        cell: ({ row }: { row: any }) => {
            const { theme } = useTheme()
            const date = new Date(row.getValue("createdAt"))
            return <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }: { row: any }) => {
            const user = row.original
            return <UserActions user={user} />
        },
    },
]
