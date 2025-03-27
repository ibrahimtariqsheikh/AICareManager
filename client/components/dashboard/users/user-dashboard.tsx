"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Plus, Bell, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
    useGetUserQuery,
    useGetUserInvitationsQuery,
    useCreateInvitationMutation,
    useCancelInvitationMutation,
    useGetInvitationsByEmailQuery,
} from "../../../state/api"
import { UserTable } from "./user-table"
import { AddUserDialog } from "./add-user-dialog"
import { LoadingSpinner } from "../../../components/ui/loading-spinner"
import { NotificationsDialog } from "./notifications-diaglog"

export function UserDashboard() {
    // State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [activeUserType, setActiveUserType] = useState("CLIENT")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [clients, setClients] = useState<User[]>([])
    const [careWorkers, setCareWorkers] = useState<User[]>([])
    const [officeStaff, setOfficeStaff] = useState<User[]>([])

    // Queries
    const { data: authUser, isLoading: isUserLoading } = useGetUserQuery()

    const {
        data: invitationsSent = [],
        isLoading: isInvitationsLoading,
        refetch: refetchInvitations,
        error: invitationsError,
    } = useGetUserInvitationsQuery(authUser?.userInfo?.id || "", {
        skip: !authUser?.userInfo?.id,
    })

    // Log the data and any errors
    useEffect(() => {
        console.log("Auth User:", authUser)
        console.log("Invitations Sent:", invitationsSent)
        console.log("Invitations Error:", invitationsError)
    }, [authUser, invitationsSent, invitationsError])

    const {
        data: invitationsReceived = [],
        isLoading: isReceivedInvitationsLoading,
        refetch: refetchReceivedInvitations,
    } = useGetInvitationsByEmailQuery(authUser?.userInfo?.email || "", {
        skip: !authUser?.userInfo?.email,
    })

    console.log("invitationsReceived", invitationsReceived)


    // Mutations
    const [createInvitation, { isLoading: isCreatingInvitation }] = useCreateInvitationMutation()
    const [cancelInvitation, { isLoading: isCancellingInvitation }] = useCancelInvitationMutation()

    // Combined loading state
    const isLoading = isUserLoading || isInvitationsLoading || isCreatingInvitation || isCancellingInvitation

    // Filter users by role and status
    const filterUsersByRole = (role: string) => {
        if (!Array.isArray(invitationsSent)) {
            console.error("invitationsSent is not an array:", invitationsSent)
            return []
        }

        return invitationsSent.filter((invitation: any) => {
            if (!invitation || typeof invitation !== "object") {
                console.error("Invalid invitation object:", invitation)
                return false
            }
            return invitation.role === role
        })
    }

    // Count users by role
    const clientCount = filterUsersByRole("CLIENT").length
    const careWorkerCount = filterUsersByRole("CARE_WORKER").length
    const officeStaffCount = filterUsersByRole("OFFICE_STAFF").length

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetchInvitations()
            await refetchReceivedInvitations()
            toast.success("Data refreshed successfully")
        } catch (error) {
            toast.error("Failed to refresh data")
        } finally {
            setIsRefreshing(false)
        }
    }

    // Handle add user
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
                refetchInvitations()
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to send invitation")
            }
        }
    }

    // Handle send invite (resend)
    const handleSendInvite = async (invitation: any) => {
        if (authUser?.userInfo?.id) {
            try {
                await createInvitation({
                    inviterUserId: authUser.userInfo.id,
                    email: invitation.email,
                    role: invitation.role,
                    expirationDays: 7,
                }).unwrap()

                toast.success(`Invitation resent to ${invitation.email}`)
                refetchInvitations()
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to resend invitation")
            }
        }
    }

    // Handle cancel invitation
    const handleCancelInvitation = async (invitation: any) => {
        if (authUser?.userInfo?.id) {
            try {
                await cancelInvitation({
                    invitationId: invitation.id,
                    userId: authUser.userInfo.id,
                }).unwrap()

                toast.success(`Invitation to ${invitation.email} has been cancelled`)
                refetchInvitations()
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to cancel invitation")
            }
        }
    }

    // Add a function to handle the server error and provide guidance
    const handleServerError = () => {
        // If we have a specific Prisma error, show a toast with guidance
        if (
            invitationsError &&
            typeof invitationsError === "object" &&
            "data" in invitationsError &&
            invitationsError.data &&
            typeof invitationsError.data === "object" &&
            "message" in invitationsError.data
        ) {
            const errorMessage = invitationsError.data.message

            if (typeof errorMessage === "string" && errorMessage.includes("prisma.invitation.findMany()")) {
                toast.error("Database query error. Please check server logs for Prisma error details.", {
                    duration: 6000,
                    description: "This is likely an issue with the database query parameters or schema.",
                })
            }
        }
    }

    useEffect(() => {
        if (invitationsError) {
            console.error("Invitation fetch error detected:", invitationsError)
            handleServerError()
        }
    }, [invitationsError])

    useEffect(() => {
        // If we have a user ID but no invitations and no error, try refetching
        if (authUser?.userInfo?.id && !isInvitationsLoading && invitationsSent.length === 0 && !invitationsError) {
            console.log("Attempting to refetch invitations...")
            refetchInvitations()
        }
    }, [authUser?.userInfo?.id, isInvitationsLoading, invitationsSent.length, invitationsError, refetchInvitations])

    if (isUserLoading) {
        return <LoadingSpinner />
    }

    if (process.env.NODE_ENV !== "production") {
        console.log("User Dashboard Debug Info:")
        console.log("- Auth User ID:", authUser?.userInfo?.id)
        console.log("- Invitations Loading:", isInvitationsLoading)
        console.log("- Invitations Error:", invitationsError)
        console.log("- Invitations Count:", Array.isArray(invitationsSent) ? invitationsSent.length : "Not an array")
    }

    // Add an error state component to display when there's a server error
    const renderErrorState = () => {
        if (!invitationsError) return null

        return (
            <div className="p-4 mb-4 border border-red-200 rounded-md bg-red-50 text-red-800">
                <h3 className="font-medium mb-1">Error fetching invitations</h3>
                <p className="text-sm mb-2">There was a problem retrieving invitations from the server.</p>
                <details className="text-xs">
                    <summary className="cursor-pointer">Technical details</summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto max-h-[200px]">
                        {JSON.stringify(invitationsError, null, 2)}
                    </pre>
                </details>
                <Button size="sm" variant="outline" className="mt-2" onClick={handleRefresh}>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">User Management</h1>
                    {authUser?.userInfo && (
                        <p className="text-sm text-muted-foreground">
                            {authUser.userInfo.role === "SOFTWARE_OWNER"
                                ? "Manage your team members and invitations"
                                : `You are logged in as ${authUser.userInfo.firstName} ${authUser.userInfo.lastName}`}
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>

                    {process.env.NODE_ENV !== "production" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                console.log("Manual fetch triggered")
                                console.log("User ID:", authUser?.userInfo?.id)
                                if (authUser?.userInfo?.id) {
                                    refetchInvitations()
                                } else {
                                    console.error("Cannot fetch: No user ID available")
                                }
                            }}
                        >
                            Debug Fetch
                        </Button>
                    )}

                    <Button size="icon" variant="outline" onClick={() => setIsNotificationsOpen(true)}>
                        <Bell className="h-4 w-4" />
                        {invitationsReceived.length > 0 && (
                            <span className="absolute left-6 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {invitationsReceived.length}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {invitationsError && renderErrorState()}

            {/* Tabbed Interface */}
            <Tabs
                defaultValue="clients"
                className="w-full"
                onValueChange={(value: string) => {
                    setActiveUserType(value === "clients" ? "CLIENT" : value === "careworkers" ? "CARE_WORKER" : "OFFICE_STAFF")
                }}
            >
                <TabsList className="grid w-full grid-cols-3">
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
                            <UserTable
                                invitations={filterUsersByRole("CLIENT")}
                                isLoading={isInvitationsLoading}
                                onSendInvite={handleSendInvite}
                                onCancelInvitation={handleCancelInvitation}
                                isCreatingInvitation={isCreatingInvitation}
                                isCancellingInvitation={isCancellingInvitation}
                            />
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
                            <UserTable
                                invitations={filterUsersByRole("CARE_WORKER")}
                                isLoading={isInvitationsLoading}
                                onSendInvite={handleSendInvite}
                                onCancelInvitation={handleCancelInvitation}
                                isCreatingInvitation={isCreatingInvitation}
                                isCancellingInvitation={isCancellingInvitation}
                            />
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
                            <UserTable
                                invitations={filterUsersByRole("OFFICE_STAFF")}
                                isLoading={isInvitationsLoading}
                                onSendInvite={handleSendInvite}
                                onCancelInvitation={handleCancelInvitation}
                                isCreatingInvitation={isCreatingInvitation}
                                isCancellingInvitation={isCancellingInvitation}
                            />
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
                invitations={invitationsReceived}
                isLoading={isReceivedInvitationsLoading}
            />
        </div>
    )
}

