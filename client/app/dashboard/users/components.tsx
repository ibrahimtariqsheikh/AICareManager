"use client"

import type React from "react"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Check, Clock, MailIcon, MoreHorizontal, Send, X, Users, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge"

// Loading Spinner Component
export function LoadingSpinner() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    )
}

// Add User Dialog Component
export function AddUserDialog({
    isOpen,
    setIsOpen,
    onAddUser,
    isLoading,
    userType,
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    onAddUser: (email: string, role: string) => void
    isLoading: boolean
    userType: string
}) {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState(userType)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddUser(email, role)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] w-full">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Enter the email address of the user you want to invite.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="CARE_WORKER">Care Worker</SelectItem>
                                    <SelectItem value="OFFICE_STAFF">Office Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Notifications Dialog Component
export function NotificationsDialog({
    isOpen,
    setIsOpen,
    invitations,
    isLoading,
    onAccept,
    onReject,
    isAcceptingInvitation,
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    invitations: any[]
    isLoading: boolean
    onAccept: (id: string) => void
    onReject: (id: string) => void
    isAcceptingInvitation: boolean
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] w-full">
                <DialogHeader>
                    <DialogTitle>Invitations</DialogTitle>
                    <DialogDescription>Manage your pending invitations.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8 w-full">
                            <LoadingSpinner />
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center w-full">
                            <MailIcon className="h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">No pending invitations</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>From</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.map((invitation) => (
                                    <TableRow key={invitation.id}>
                                        <TableCell>{invitation.inviterEmail}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{invitation.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4 text-amber-500" />
                                                <span className="text-xs">Pending</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onAccept(invitation.id)}
                                                    disabled={isAcceptingInvitation}
                                                >
                                                    <Check className="mr-1 h-4 w-4" />
                                                    Accept
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => onReject(invitation.id)}>
                                                    <X className="mr-1 h-4 w-4" />
                                                    Reject
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Users Table Component
export function UsersTable({
    users,
    isLoading,
    onSendInvite,
    onCancelInvitation,
    isCreatingInvitation,
    isCancellingInvitation,
    userType,
}: {
    users: any[]
    isLoading: boolean
    onSendInvite: (user: any) => void
    onCancelInvitation: (user: any) => void
    isCreatingInvitation: boolean
    isCancellingInvitation: boolean
    userType: string
}) {
    const filteredUsers = users.filter((user) => user.role === userType)

    return (
        <div className="w-full overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8 w-full">
                        <LoadingSpinner />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center w-full">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">No {userType.toLowerCase()} users found</p>
                    </div>
                ) : (
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Invited On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.status === "PENDING" ? (
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-4 w-4 text-amber-500" />
                                                <span className="text-xs">Pending</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Check className="mr-1 h-4 w-4 text-green-500" />
                                                <span className="text-xs">Active</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {user.status === "PENDING" && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => onSendInvite(user)} disabled={isCreatingInvitation}>
                                                            <Send className="mr-2 h-4 w-4" />
                                                            Resend Invitation
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onCancelInvitation(user)} disabled={isCancellingInvitation}>
                                                            <X className="mr-2 h-4 w-4" />
                                                            Cancel Invitation
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {user.status === "ACTIVE" && (
                                                    <DropdownMenuItem>
                                                        <Users className="mr-2 h-4 w-4" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}
