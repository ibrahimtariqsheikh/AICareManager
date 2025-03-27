"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge"
import { MoreHorizontal, Send, X, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "../../../components/ui/skeleton"

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

    // Add debugging
    console.log("UserTable received invitations:", invitations)

    // Check if invitations is an array
    const invitationsArray = Array.isArray(invitations) ? invitations : []

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="flex items-center gap-1 text-yellow-500 border-yellow-200 bg-yellow-50">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                )
            case "ACCEPTED":
                return (
                    <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-200 bg-green-50">
                        <CheckCircle className="h-3 w-3" />
                        Accepted
                    </Badge>
                )
            case "EXPIRED":
                return (
                    <Badge variant="outline" className="flex items-center gap-1 text-orange-500 border-orange-200 bg-orange-50">
                        <AlertCircle className="h-3 w-3" />
                        Expired
                    </Badge>
                )
            case "CANCELED":
                return (
                    <Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-200 bg-red-50">
                        <X className="h-3 w-3" />
                        Canceled
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="flex items-center gap-1">
                        Unknown
                    </Badge>
                )
        }
    }

    // Handle action
    const handleAction = (action: "resend" | "cancel", invitation: any) => {
        setActionInvitationId(invitation.id)
        if (action === "resend") {
            onSendInvite(invitation)
        } else {
            onCancelInvitation(invitation)
        }
    }

    // Check if action is in progress
    const isActionInProgress = (invitationId: string) => {
        return actionInvitationId === invitationId && (isCreatingInvitation || isCancellingInvitation)
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="p-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 py-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Empty state - update to show more information
    if (!invitationsArray.length) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground mb-2">No invitations found</p>
                <p className="text-xs text-muted-foreground">
                    {Array.isArray(invitations)
                        ? "You haven't sent any invitations yet."
                        : "Received invalid data format. Check console for details."}
                </p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited On</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invitationsArray.map((invitation) => (
                    <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                        <TableCell>{format(new Date(invitation.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(invitation.expiresAt), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                            {invitation.status === "PENDING" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isActionInProgress(invitation.id)}>
                                            {isActionInProgress(invitation.id) ? (
                                                <span className="animate-spin">⏳</span>
                                            ) : (
                                                <MoreHorizontal className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleAction("resend", invitation)}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Resend Invitation
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleAction("cancel", invitation)}
                                            className="text-red-500 focus:text-red-500"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel Invitation
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

