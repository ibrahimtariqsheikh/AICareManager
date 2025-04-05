"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, Bell, RefreshCw, Users, UserPlus, Briefcase, Search } from "lucide-react"
import { toast } from "sonner"
import {
    useGetUserQuery,
    useGetUserInvitationsQuery,
    useCreateInvitationMutation,
    useCancelInvitationMutation,
    useGetInvitationsByEmailQuery,
} from "../../state/api"
import { UserTable } from "./user-table"
import { AddUserDialog } from "./add-user-dialog"
import { LoadingSpinner } from "../ui/loading-spinner"
import { NotificationsDialog } from "./notifications-diaglog"
import { Input } from "../ui/input"
import { AvatarGroup } from "../ui/avatar-group"
import { Avatar, AvatarFallback } from "../ui/avatar"


export function InvitesDashboard() {
    // State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [activeUserType, setActiveUserType] = useState("CLIENT")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredInvitations, setFilteredInvitations] = useState<any[]>([])

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

    const {
        data: invitationsReceived = [],
        isLoading: isReceivedInvitationsLoading,
        refetch: refetchReceivedInvitations,
    } = useGetInvitationsByEmailQuery(authUser?.userInfo?.email || "", {
        skip: !authUser?.userInfo?.email,
    })

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

    // Filter by search query
    const filterBySearch = (invitations: any[]) => {
        if (!searchQuery) return invitations

        return invitations.filter((invitation) => invitation.email.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Update filtered invitations when search query or active user type changes
    useEffect(() => {
        const roleFiltered = filterUsersByRole(activeUserType)
        const searchFiltered = filterBySearch(roleFiltered)
        setFilteredInvitations(searchFiltered)
    }, [searchQuery, activeUserType, invitationsSent])

    // Count users by role
    const clientCount = filterUsersByRole("CLIENT").length
    const careWorkerCount = filterUsersByRole("CARE_WORKER").length
    const officeStaffCount = filterUsersByRole("OFFICE_STAFF").length

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            // Comment out actual API calls
            // await refetchInvitations()
            // await refetchReceivedInvitations()

            // Simulate refresh delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Data refreshed successfully")
        } catch (error) {
            toast.error("Failed to refresh data")
        } finally {
            setIsRefreshing(false)
        }
    }

    // Handle add user
    const handleAddUser = async (email: string, role: string) => {
        if (email) {
            try {
                // Comment out actual API call
                // await createInvitation({
                //     inviterUserId: authUser.userInfo.id,
                //     email: email,
                //     role: role,
                //     expirationDays: 7,
                // }).unwrap()

                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 1000))

                toast.success(`Invitation sent to ${email}`)
                setIsAddUserOpen(false)

                // Add the new invitation to the local state for demo purposes
                const newInvitation = {
                    id: `temp-${Date.now()}`,
                    email: email,
                    role: role,
                    status: "PENDING",
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }

                // This is just for UI demonstration - in a real app, you'd refetch from the API
                if (Array.isArray(invitationsSent)) {
                    const updatedInvitations = [...invitationsSent, newInvitation]
                    // Force a re-render with the new invitation
                    const roleFiltered = updatedInvitations.filter((inv: any) => inv.role === activeUserType)
                    const searchFiltered = filterBySearch(roleFiltered)
                    setFilteredInvitations(searchFiltered)
                }
            } catch (error: any) {
                toast.error(error.data?.error || "Failed to send invitation")
            }
        }
    }

    // Handle send invite (resend)
    const handleSendInvite = async (invitation: any) => {
        try {
            // Comment out actual API call
            // await createInvitation({
            //     inviterUserId: authUser.userInfo.id,
            //     email: invitation.email,
            //     role: invitation.role,
            //     expirationDays: 7,
            // }).unwrap()

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success(`Invitation resent to ${invitation.email}`)
        } catch (error: any) {
            toast.error(error.data?.error || "Failed to resend invitation")
        }
    }

    // Handle cancel invitation
    const handleCancelInvitation = async (invitation: any) => {
        try {
            // Comment out actual API call
            // await cancelInvitation({
            //     invitationId: invitation.id,
            //     userId: authUser.userInfo.id,
            // }).unwrap()

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success(`Invitation to ${invitation.email} has been cancelled`)

            // This is just for UI demonstration - in a real app, you'd refetch from the API
            if (Array.isArray(invitationsSent)) {
                const updatedInvitations = invitationsSent.filter((inv) => inv.id !== invitation.id)
                // Force a re-render without the cancelled invitation
                const roleFiltered = updatedInvitations.filter((inv: any) => inv.role === activeUserType)
                const searchFiltered = filterBySearch(roleFiltered)
                setFilteredInvitations(searchFiltered)
            }
        } catch (error: any) {
            toast.error(error.data?.error || "Failed to cancel invitation")
        }
    }

    if (isUserLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Invitations</h1>
                    <p className="text-gray-500 mt-1">Manage your team members and invitations</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search emails..."
                            className="pl-9 h-9 w-[220px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button onClick={() => setIsAddUserOpen(true)} className="bg-gray-900 hover:bg-gray-800">
                        <Plus className="h-4 w-4 mr-1" />
                        Add User
                    </Button>

                    <Button size="icon" variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => setIsNotificationsOpen(true)} className="relative">
                        <Bell className="h-4 w-4" />
                        {invitationsReceived.length > 0 && (
                            <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {invitationsReceived.length}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* User Type Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "CLIENT" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveUserType("CLIENT")}
                >
                    <Users className="h-4 w-4" />
                    Clients ({clientCount})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "CARE_WORKER" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveUserType("CARE_WORKER")}
                >
                    <UserPlus className="h-4 w-4" />
                    Care Workers ({careWorkerCount})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "OFFICE_STAFF" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveUserType("OFFICE_STAFF")}
                >
                    <Briefcase className="h-4 w-4" />
                    Office Staff ({officeStaffCount})
                </button>
            </div>

            {/* User Content */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    {activeUserType === "CLIENT" && (
                        <>
                            <div className="p-1.5 rounded-full bg-blue-50">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold">Clients</h2>
                        </>
                    )}
                    {activeUserType === "CARE_WORKER" && (
                        <>
                            <div className="p-1.5 rounded-full bg-green-50">
                                <UserPlus className="h-4 w-4 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold">Care Workers</h2>
                        </>
                    )}
                    {activeUserType === "OFFICE_STAFF" && (
                        <>
                            <div className="p-1.5 rounded-full bg-purple-50">
                                <Briefcase className="h-4 w-4 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold">Office Staff</h2>
                        </>
                    )}
                </div>

                <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-0">
                        <UserTable
                            users={
                                filteredInvitations.length > 0 ? filteredInvitations : filterBySearch(filterUsersByRole(activeUserType))
                            }
                            isLoading={isInvitationsLoading}
                            onSendInvite={handleSendInvite}
                            onCancelInvitation={handleCancelInvitation}
                            isCreatingInvitation={isCreatingInvitation}
                            isCancellingInvitation={isCancellingInvitation}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <AddUserDialog
                isOpen={isAddUserOpen}
                setIsOpen={setIsAddUserOpen}
                onAddUser={handleAddUser}
                isLoading={isCreatingInvitation}
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

