"use client"

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

interface UserTableProps {
    users: User[]
    isLoading: boolean
    onSendInvite?: (email: string, role: Role) => Promise<void>
    onCancelInvitation?: (invitationId: string) => Promise<void>
    isCreatingInvitation?: boolean
    isCancellingInvitation?: boolean
}

export function UserTable({
    users,
    isLoading,
    onSendInvite,
    onCancelInvitation,
    isCreatingInvitation,
    isCancellingInvitation
}: UserTableProps) {
    if (isLoading) {
        return <LoadingSpinner />
    }

    const getInitials = (user: User) => {
        const firstInitial = user.firstName?.[0]?.toUpperCase() || ''
        const lastInitial = user.lastName?.[0]?.toUpperCase() || ''
        return firstInitial + lastInitial || 'U'
    }

    return (
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
                {users.map((user) => (
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
    )
}

