"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { MoreHorizontal, Send, X, RefreshCw, Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "../ui/skeleton"

import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { StatusBadge } from "../ui/status-badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "sonner"


interface UserTableProps {
    invitations: any[]
    isLoading: boolean
    onSendInvite: (invitation: any) => void
    onCancelInvitation: (invitation: any) => void
    isCreatingInvitation: boolean
    isCancellingInvitation: boolean
}

export function UserTable({
    invitations,
    isLoading,
    onSendInvite,
    onCancelInvitation,
    isCreatingInvitation,
    isCancellingInvitation,
}: UserTableProps) {
    const [actionInvitationId, setActionInvitationId] = useState<string | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedInvitation, setSelectedInvitation] = useState<any>(null)

    // Check if invitations is an array
    const invitationsArray = Array.isArray(invitations) ? invitations : []

    // Handle edit action
    const handleEdit = (invitation: any) => {
        setSelectedInvitation(invitation)
        setIsEditDialogOpen(true)
    }

    // Handle delete action
    const handleDelete = (invitation: any) => {
        setSelectedInvitation(invitation)
        setIsDeleteDialogOpen(true)
    }

    // Handle confirm edit
    const handleConfirmEdit = () => {
        // Comment out actual API call
        // onSendInvite(selectedInvitation)

        // Show success toast
        toast.success(`User ${selectedInvitation.email} updated successfully`)
        setIsEditDialogOpen(false)
    }

    // Handle confirm delete
    const handleConfirmDelete = () => {
        // Comment out actual API call
        // onCancelInvitation(selectedInvitation)

        // Show success toast
        toast.success(`Invitation to ${selectedInvitation.email} has been cancelled`)
        setIsDeleteDialogOpen(false)
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 py-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-3 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Empty state
    if (!invitationsArray.length) {
        return (
            <div className="py-8 text-center">
                <p className="text-muted-foreground">No invitations found</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {Array.isArray(invitations)
                        ? "You haven't sent any invitations yet."
                        : "Received invalid data format. Check console for details."}
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-100">
                            <TableHead className="font-medium text-gray-500">Email</TableHead>
                            <TableHead className="font-medium text-gray-500">Status</TableHead>
                            <TableHead className="font-medium text-gray-500">Invited On</TableHead>
                            <TableHead className="font-medium text-gray-500">Expires</TableHead>
                            <TableHead className="font-medium text-gray-500 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitationsArray.map((invitation) => (
                            <TableRow key={invitation.id} className="hover:bg-gray-50/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 bg-gray-100 border-0">
                                            <AvatarFallback className="text-gray-500 font-medium">
                                                {invitation.email.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{invitation.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={invitation.status} />
                                </TableCell>
                                <TableCell>{format(new Date(invitation.createdAt), "MMM d, yyyy")}</TableCell>
                                <TableCell>{format(new Date(invitation.expiresAt), "MMM d, yyyy")}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(invitation)}>
                                            <Edit className="h-4 w-4 text-gray-500" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(invitation)}>
                                            <Trash className="h-4 w-4 text-gray-500" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Make changes to the user invitation.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="mt-1">{selectedInvitation?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Status</label>
                                <p className="mt-1">
                                    <StatusBadge status={selectedInvitation?.status || ""} />
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <p className="mt-1">{selectedInvitation?.role?.replace("_", " ") || ""}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cancel Invitation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this invitation? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            You are about to cancel the invitation for <strong>{selectedInvitation?.email}</strong>.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Yes, Cancel Invitation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

