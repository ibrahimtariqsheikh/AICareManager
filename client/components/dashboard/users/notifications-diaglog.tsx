"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Skeleton } from "../../../components/ui/skeleton"
import { useAcceptInvitationMutation } from "../../../state/api"
import { toast } from "sonner"
import { useAppSelector } from "../../../state/redux"
import { format } from "date-fns"

interface NotificationsDialogProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    invitations: any[]
    isLoading: boolean
}

export function NotificationsDialog({ isOpen, setIsOpen, invitations, isLoading }: NotificationsDialogProps) {
    const [processingInvitationId, setProcessingInvitationId] = useState<string | null>(null)
    const { userInfo } = useAppSelector((state) => state.auth)

    // Accept invitation mutation
    const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation()

    // Handle accept invitation
    const handleAcceptInvitation = async (invitationId: string) => {
        if (!userInfo?.cognitoId) return

        setProcessingInvitationId(invitationId)
        try {
            await acceptInvitation({
                invitationId,
                userId: userInfo.cognitoId,
            }).unwrap()

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
        // This would typically call an API to reject the invitation
        // For now, we'll just show a success message
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
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
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
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">
                                                {invitation.inviter?.firstName} {invitation.inviter?.lastName}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{invitation.inviter?.email}</p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(invitation.createdAt), "MMM d, yyyy")}
                                        </div>
                                    </div>

                                    <p className="text-sm">
                                        Invited you to join as a <span className="font-medium">{invitation.role.replace("_", " ")}</span>
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Expires on {format(new Date(invitation.expiresAt), "MMM d, yyyy")}
                                    </p>

                                    <div className="flex justify-end space-x-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRejectInvitation(invitation.id)}
                                            disabled={processingInvitationId === invitation.id && isAccepting}
                                        >
                                            Decline
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAcceptInvitation(invitation.id)}
                                            disabled={processingInvitationId === invitation.id && isAccepting}
                                        >
                                            {processingInvitationId === invitation.id && isAccepting ? (
                                                <span className="animate-spin mr-2">⏳</span>
                                            ) : null}
                                            Accept
                                        </Button>
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

