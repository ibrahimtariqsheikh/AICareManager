"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Bell, RefreshCw, Users, UserPlus, Briefcase, Search, Badge } from 'lucide-react'
import { toast } from "sonner"
import {
    useGetUserQuery,
    useGetUserInvitationsQuery,
    useCreateUserMutation,
    useCancelInvitationMutation,
    useGetInvitationsByEmailQuery,
    useGetAgencyUsersQuery,
} from "@/state/api"
import { UserTable } from "./user-table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { NotificationsDialog } from "./notifications-diaglog"
import { Input } from "@/components/ui/input"
import { Role, User, SubRole } from "@/types/prismaTypes"
import { AddUsersNewDialog } from "./add-users-new-dialog"
import { getCurrentUser } from "aws-amplify/auth"
import { useDispatch, useSelector } from "react-redux"
import { setClients, setOfficeStaff, setCareWorkers } from "@/state/slices/agencySlice"
import { v4 as uuidv4 } from "uuid"
import { useAppSelector } from "@/state/redux"
import { UserTableUser } from "./user-table-user"

export function UserDashboard() {
    // State
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [activeUserType, setActiveUserType] = useState<Role>("CLIENT")

    // Redux
    const dispatch = useDispatch()
    const { data: userData } = useGetUserQuery()
    const { clients, officeStaff, careWorkers } = useAppSelector((state) => state.agency)
    const { data: agencyUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetAgencyUsersQuery(userData?.userInfo?.agencyId || "")
    const { data: invitations, isLoading: isInvitationsLoading } = useGetUserInvitationsQuery(userData?.userInfo?.id || "")
    const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation()


    // Filter users based on search query and user type
    const filteredUsers = (() => {
        const users = activeUserType === "CLIENT" ? clients :
            activeUserType === "CARE_WORKER" ? careWorkers :
                officeStaff

        return users.filter((user: User) => {
            const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
    })()

    // Update Redux state when agency users are fetched
    useEffect(() => {
        if (agencyUsers?.data) {
            const users = agencyUsers.data as User[]
            dispatch(setClients(users.filter(user => user.role === "CLIENT")))
            dispatch(setOfficeStaff(users.filter(user => user.role === "OFFICE_STAFF")))
            dispatch(setCareWorkers(users.filter(user => user.role === "CARE_WORKER")))
        }
    }, [agencyUsers?.data, dispatch])

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refetchUsers()
            toast.success("Users refreshed successfully")
        } catch (error) {
            toast.error("Failed to refresh users")
        } finally {
            setIsRefreshing(false)
        }
    }

    // Handle creating user
    const handleAddUser = async (firstName: string, lastName: string, agencyId: string, email: string, role: Role, subRole?: SubRole) => {
        try {
            await createUser({
                email,
                role,
                subRole,
                firstName,
                lastName,
                cognitoId: uuidv4(),
                agencyId
            })
            setIsAddUserDialogOpen(false)
            toast.success("User created successfully")
            await refetchUsers()
        } catch (error) {
            console.error("Failed to create user:", error)
            toast.error("Failed to create user")
        }
    }

    if (isLoadingUsers) {
        return <LoadingSpinner />
    }

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Users</h1>
                        <div className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md">{userData?.userInfo?.role}</div>
                    </div>
                    <p className="text-gray-500 mt-1">Manage the users in your agency. Edit, delete, and add users as needed.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9 h-9 w-[220px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button onClick={() => setIsAddUserDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>

                    <Button size="icon" variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => setIsNotificationsOpen(true)} className="relative">
                        <Bell className="h-4 w-4" />
                        {invitations && invitations.length > 0 && (
                            <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {invitations.length}
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
                    Clients ({clients.length})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "CARE_WORKER" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveUserType("CARE_WORKER")}
                >
                    <UserPlus className="h-4 w-4" />
                    Care Workers ({careWorkers.length})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "OFFICE_STAFF" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => setActiveUserType("OFFICE_STAFF")}
                >
                    <Briefcase className="h-4 w-4" />
                    Office Staff ({officeStaff.length})
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
                        <UserTableUser
                            users={filteredUsers}
                            isLoading={isLoadingUsers}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <AddUsersNewDialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
                onAddUser={handleAddUser}
                isCreatingUser={isCreatingUser}
            />

            <NotificationsDialog
                isOpen={isNotificationsOpen}
                setIsOpen={setIsNotificationsOpen}
                invitations={invitations || []}
                isLoading={isInvitationsLoading}
            />
        </div>
    )
}