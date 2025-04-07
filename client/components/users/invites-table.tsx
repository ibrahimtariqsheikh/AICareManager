"use client"

import { useState } from "react"
import { Role, User } from "../../types/prismaTypes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Button } from "../ui/button"
import { MoreHorizontal, Mail, X } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { PaginationControls } from "./pagination-controls"

interface InvitesTableProps {
    users: User[]
    isLoading: boolean
    onSendInvite?: (email: string, role: Role) => Promise<void>
    onCancelInvitation?: (invitationId: string) => Promise<void>
    isCreatingInvitation?: boolean
    isCancellingInvitation?: boolean
}

export function InvitesTable({
    users,
    isLoading,
    onSendInvite,
    onCancelInvitation,
    isCreatingInvitation,
    isCancellingInvitation
}: InvitesTableProps) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

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
        return <LoadingSpinner />
    }

    const getInitials = (user: User) => {
        const firstInitial = user.firstName?.[0]?.toUpperCase() || ''
        const lastInitial = user.lastName?.[0]?.toUpperCase() || ''
        return firstInitial + lastInitial || 'U'
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            {onSendInvite && onCancelInvitation && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={user.profile?.avatarUrl} />
                                            <AvatarFallback>
                                                {getInitials(user)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.firstName || 'Unknown'} {user.lastName || 'User'}</div>
                                            <div className="text-sm text-gray-500">{user.role}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="default">Active</Badge>
                                </TableCell>
                                {onSendInvite && onCancelInvitation && (
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => onSendInvite(user.email, user.role)}
                                                    disabled={isCreatingInvitation}
                                                >
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Resend Invite
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onCancelInvitation(user.id)}
                                                    disabled={isCancellingInvitation}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel Invite
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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