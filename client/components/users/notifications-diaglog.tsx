"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { toast } from "sonner"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { RefreshCw } from "lucide-react"

interface NotificationsDialogProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    invitations: any[]
    isLoading: boolean
}

export function NotificationsDialog({ isOpen, setIsOpen, invitations, isLoading }: NotificationsDialogProps) {
    const [processingInvitationId, setProcessingInvitationId] = useState<string | null>(null)

    // Handle accept invitation
    const handleAcceptInvitation = async (invitationId: string) => {
        setProcessingInvitationId(invitationId)
        try {
            // Comment out actual API call
            // await acceptInvitation({
            //     invitationId,
            //     userId: userInfo.cognitoId,
            // }).unwrap()

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Invitation accepted successfully")
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.data?.error || "Failed to accept invitation")
        } finally {
            setProcessingInvitationId(null)
        }
    }

    // Handle reject invitation
    const handleRejectInvitation = async (invitationId: string) => {
        // Comment out actual API call
        // await rejectInvitation({
        //     invitationId,
        // }).unwrap()

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        toast.success("Invitation rejected")
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Invitations</DialogTitle>
                    <DialogDescription>View and manage invitations you've received</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center space-x-4 py-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-3 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : invitations.length === 0 ? (
                    <div className="py-6 text-center">
                        <p className="text-muted-foreground">You have no pending invitations</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {invitations.map((invitation) => (
                            <div key={invitation.id} className="border rounded-lg p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10 bg-gray-100 border-0">
                                        {invitation.inviter?.image ? <AvatarImage src={invitation.inviter.image} /> : null}
                                        <AvatarFallback className="text-gray-500 font-medium">
                                            {invitation.inviter?.fullName?.charAt(0) || ""}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">
                                                    {invitation.inviter?.fullName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">{invitation.inviter?.email}</p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(invitation.createdAt), "MMM d, yyyy")}
                                            </div>
                                        </div>

                                        <p className="text-sm mt-2">
                                            Invited you to join as a <span className="font-medium">{invitation.role.replace("_", " ")}</span>
                                        </p>

                                        <p className="text-xs text-muted-foreground mt-1">
                                            Expires on {format(new Date(invitation.expiresAt), "MMM d, yyyy")}
                                        </p>

                                        <div className="flex justify-end space-x-2 pt-3 mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRejectInvitation(invitation.id)}
                                                disabled={processingInvitationId === invitation.id}
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAcceptInvitation(invitation.id)}
                                                disabled={processingInvitationId === invitation.id}
                                            >
                                                {processingInvitationId === invitation.id ? (
                                                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                ) : null}
                                                Accept
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

