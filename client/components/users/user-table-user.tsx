"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserActionsMenu } from "./users-actions-menu"
import type { User } from "@/types/prismaTypes"
import { PaginationControls } from "./pagination-controls"

interface UserTableUserProps {
    users: User[]
    isLoading: boolean
}

export function UserTableUser({ users, isLoading }: UserTableUserProps) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Handle user deletion
    const handleDeleteUser = async (userId: string) => {
        try {
            // await deleteUser(userId)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // Get status badge color
    const getStatusBadge = (status?: string) => {
        if (!status) return null

        switch (status.toLowerCase()) {
            case "active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Active</Badge>
            case "inactive":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">Inactive</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0">Pending</Badge>
            default:
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">{status}</Badge>
        }
    }

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString()
    }

    // Get initials for avatar
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "??"
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`
    }

    // Calculate pagination
    const totalPages = Math.ceil(users.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = users.slice(startIndex, endIndex)

    // Handle page change
    const goToPage = (page: number) => {
        setCurrentPage(page)
    }

    // Handle page size change
    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (users.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground">No users found</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subrole</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.profile?.avatarUrl || ""} alt={`${user.firstName} ${user.lastName}`} />
                                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            {user.role === "CLIENT" && user.clientId && (
                                                <div className="text-xs text-gray-500">ID: {user.clientId.substring(0, 8)}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status || "Active")}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {user.subRole ? user.subRole.replace(/_/g, " ") : "None"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <UserActionsMenu user={user} onDeleteUser={handleDeleteUser} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={users.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={goToPage}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    )
}

