"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import {
    useGetUserQuery,
    useGetUserInvitationsQuery,
    useCreateInvitationMutation,
    useCancelInvitationMutation,
    useGetInvitationsByEmailQuery,
    useAcceptInvitationMutation,
} from "../../../state/api"
import { Button } from "../../../components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"

import { Bell, Plus } from "lucide-react"

import { toast } from "sonner"
import { AddUserDialog, LoadingSpinner, NotificationsDialog, UsersTable } from "./components"

// Main component
const UsersPage = () => {
    const router = useRouter()
    const { signOut, user } = useAuthenticator((context) => [context.signOut, context.user])

    // State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const [activeUserType, setActiveUserType] = useState("CLIENT")

    // Queries
    const { data: authUser, isLoading: isUserLoading, error: userError } = useGetUserQuery()

    const { data: allUsers = [], isLoading: isUsersLoading } = useGetUserInvitationsQuery(authUser?.userInfo?.id || "", {
        skip: !authUser?.userInfo?.id,
    })

    const { data: invitations = [], isLoading: isInvitationsLoading } = useGetInvitationsByEmailQuery(
        authUser?.userInfo?.email || "",
        { skip: !authUser?.userInfo?.email },
    )

    // Mutations
    const [createInvitation, { isLoading: isCreatingInvitation }] = useCreateInvitationMutation()
    const [cancelInvitation, { isLoading: isCancellingInvitation }] = useCancelInvitationMutation()
    const [acceptInvitation, { isLoading: isAcceptingInvitation }] = useAcceptInvitationMutation()

    // Combined loading state
    const isLoading = isUserLoading || isUsersLoading || isCreatingInvitation || isCancellingInvitation

    // Handle user error
    useEffect(() => {
        if (userError) {
            toast.error(`${userError}`)
        }
    }, [userError])

    // Authentication check
    useEffect(() => {
        if (!user && !isUserLoading) {
            setShouldRedirect(true)
        }
    }, [user, isUserLoading])

    // Handle redirect
    useEffect(() => {
        if (shouldRedirect) {
            router.push("/")
        }
    }, [shouldRedirect, router])

    // Handlers
    const handleSignOut = async () => {
        await signOut()
        localStorage.clear()
        sessionStorage.clear()
        router.push("/")
    }

    const handleAddUser = async (email: string, role: string) => {
        if (email && authUser?.userInfo?.id) {
            try {
                await createInvitation({
                    inviterUserId: authUser.userInfo.id,
                    email: email,
                    role: role,
                    expirationDays: 7,
                }).unwrap()

                toast.success(`Invitation sent to ${email}`)
                setIsAddUserOpen(false)
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to send invitation")
            }
        }
    }

    const handleSendInvite = async (user: any) => {
        if (authUser?.userInfo?.id) {
            try {
                await createInvitation({
                    inviterUserId: authUser.userInfo.id,
                    email: user.email,
                    role: user.role,
                    expirationDays: 7,
                }).unwrap()

                toast.success(`Invitation resent to ${user.email}`)
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to resend invitation")
            }
        }
    }

    const handleCancelInvitation = async (user: any) => {
        if (authUser?.userInfo?.id) {
            try {
                await cancelInvitation({
                    invitationId: user.id,
                    userId: authUser.userInfo.id,
                }).unwrap()

                toast.success(`Invitation to ${user.email} has been cancelled`)
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to cancel invitation")
            }
        }
    }

    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await acceptInvitation({
                invitationId,
                userId: authUser?.userInfo?.id || "",
            })
            toast.success("Invitation accepted")
            setIsNotificationsOpen(false)
        } catch (error: any) {
            toast.error(error.data?.error || "Failed to accept invitation")
        }
    }

    const handleRejectInvitation = async (invitationId: string) => {
        // TODO: Implement reject invitation functionality
        toast.success("Invitation rejected")
        setIsNotificationsOpen(false)
    }

    // Count users by role
    const clientCount = allUsers.filter((user: any) => user.role === "CLIENT").length
    const careWorkerCount = allUsers.filter((user: any) => user.role === "CARE_WORKER").length
    const officeStaffCount = allUsers.filter((user: any) => user.role === "OFFICE_STAFF").length

    // Return loading spinner if needed
    if (shouldRedirect || isUserLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 min-h-screen min-w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">User Management

                    </h1>
                    {authUser?.userInfo && (
                        <p className="text-sm text-muted-foreground">
                            Welcome, {authUser.cognitoInfo.username} ({authUser.userInfo.email})
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="secondary" onClick={() => setIsNotificationsOpen(true)}>
                        <Bell className="h-4 w-4" />
                        {invitations.length > 0 && (
                            <span className="absolute left-6 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {invitations.length}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Role Info */}
            <div>
                <p className="text-sm md:text-md text-muted-foreground break-words">
                    {authUser?.userInfo?.role === "SOFTWARE_OWNER"
                        ? "SOFTWARE OWNER: You own the place and can invite users to join your workspace. You can also manage your workspace and users. And you can also manage your workspace and users."
                        : `You are a ${authUser?.userInfo?.role} and you were invited by ID ${authUser?.userInfo?.invitedById}`}
                </p>
            </div>

            {/* Tabbed Interface */}
            <Tabs
                defaultValue="clients"
                className="w-full"
                onValueChange={(value: string) => {
                    setActiveUserType(value === "clients" ? "CLIENT" : value === "careworkers" ? "CARE_WORKER" : "OFFICE_STAFF")
                }}
            >
                <TabsList className="grid w-full grid-cols-3 justify-center items-center mx-auto">
                    <TabsTrigger value="clients" className="text-xs sm:text-sm">
                        Clients ({clientCount})
                    </TabsTrigger>
                    <TabsTrigger value="careworkers" className="text-xs sm:text-sm">
                        Care Workers ({careWorkerCount})
                    </TabsTrigger>
                    <TabsTrigger value="officestaff" className="text-xs sm:text-sm">
                        Office Staff ({officeStaffCount})
                    </TabsTrigger>
                </TabsList>

                {/* Clients Tab */}
                <TabsContent value="clients">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Clients</CardTitle>
                                <CardDescription>Manage your client relationships and invitations</CardDescription>
                            </div>
                            <Button
                                onClick={() => {
                                    setActiveUserType("CLIENT")
                                    setIsAddUserOpen(true)
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Client
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <div className="min-w-full">
                                <UsersTable
                                    users={allUsers}
                                    isLoading={isUsersLoading}
                                    onSendInvite={handleSendInvite}
                                    onCancelInvitation={handleCancelInvitation}
                                    isCreatingInvitation={isCreatingInvitation}
                                    isCancellingInvitation={isCancellingInvitation}
                                    userType="CLIENT"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Care Workers Tab */}
                <TabsContent value="careworkers">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Care Workers</CardTitle>
                                <CardDescription>Manage your care team members and invitations</CardDescription>
                            </div>
                            <Button
                                onClick={() => {
                                    setActiveUserType("CARE_WORKER")
                                    setIsAddUserOpen(true)
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Care Worker
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <div className="min-w-full">
                                <UsersTable
                                    users={allUsers}
                                    isLoading={isUsersLoading}
                                    onSendInvite={handleSendInvite}
                                    onCancelInvitation={handleCancelInvitation}
                                    isCreatingInvitation={isCreatingInvitation}
                                    isCancellingInvitation={isCancellingInvitation}
                                    userType="CARE_WORKER"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Office Staff Tab */}
                <TabsContent value="officestaff">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Office Staff</CardTitle>
                                <CardDescription>Manage your administrative team members and invitations</CardDescription>
                            </div>
                            <Button
                                onClick={() => {
                                    setActiveUserType("OFFICE_STAFF")
                                    setIsAddUserOpen(true)
                                }}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Office Staff
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <div className="min-w-full">
                                <UsersTable
                                    users={allUsers}
                                    isLoading={isUsersLoading}
                                    onSendInvite={handleSendInvite}
                                    onCancelInvitation={handleCancelInvitation}
                                    isCreatingInvitation={isCreatingInvitation}
                                    isCancellingInvitation={isCancellingInvitation}
                                    userType="OFFICE_STAFF"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <AddUserDialog
                isOpen={isAddUserOpen}
                setIsOpen={setIsAddUserOpen}
                onAddUser={handleAddUser}
                isLoading={isCreatingInvitation}
                userType={activeUserType}
            />

            <NotificationsDialog
                isOpen={isNotificationsOpen}
                setIsOpen={setIsNotificationsOpen}
                invitations={invitations}
                isLoading={isInvitationsLoading}
                onAccept={handleAcceptInvitation}
                onReject={handleRejectInvitation}
                isAcceptingInvitation={isAcceptingInvitation}
            />
        </div>
    )
}

export default UsersPage

