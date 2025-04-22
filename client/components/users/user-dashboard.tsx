"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Briefcase } from 'lucide-react'
import { toast } from "sonner"
import {
    useGetUserQuery,
    useCreateUserMutation,
    useGetAgencyUsersQuery,
} from "@/state/api"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Role, User, SubRole } from "@/types/prismaTypes"
import { AddUsersNewDialog } from "./add-users-new-dialog"
import { useDispatch } from "react-redux"
import { setClients, setOfficeStaff, setCareWorkers } from "@/state/slices/agencySlice"
import { setActiveUserType } from "@/state/slices/userSlice"
import { v4 as uuidv4 } from "uuid"
import { useAppSelector } from "@/state/redux"
import { UserTableUser } from "./user-table-user"


export function UserDashboard() {
    // State
    const [searchQuery, _] = useState("")
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)


    const activeUserType = useAppSelector((state) => state.user.activeUserType)

    // Redux
    const dispatch = useDispatch()
    const { data: userData } = useGetUserQuery()
    const { clients, officeStaff, careWorkers } = useAppSelector((state) => state.agency)
    const { data: agencyUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetAgencyUsersQuery(userData?.userInfo?.agencyId || "")
    const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation()

    const filteredUsers = (() => {
        const users = activeUserType === "CLIENT" ? clients :
            activeUserType === "CARE_WORKER" ? careWorkers :
                officeStaff

        return users.filter((user: User) => {
            const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
        })
    })()

    useEffect(() => {
        if (agencyUsers?.data) {
            const users = agencyUsers.data as User[]
            dispatch(setClients(users.filter(user => user.role === "CLIENT")))
            dispatch(setOfficeStaff(users.filter(user => user.role === "OFFICE_STAFF")))
            dispatch(setCareWorkers(users.filter(user => user.role === "CARE_WORKER")))
        }
    }, [agencyUsers?.data, dispatch])


    // Handle creating user
    const handleAddUser = async (fullName: string, agencyId: string, email: string, role: Role, subRole?: SubRole) => {
        try {
            const newUserInput = {
                email,
                role,
                fullName,
                cognitoId: uuidv4(),
                agencyId,
                inviterId: userData?.userInfo?.id || "",
                ...(subRole ? { subRole } : {})
            };

            await createUser(newUserInput);
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
                        <h1 className="text-2xl font-bold">User Management</h1>

                    </div>
                    <p className="text-gray-500 mt-1">Manage the users in your agency and their account permissions here.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input type="text" id="medium-input" className="shadow-none block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div> */}

                    <Button onClick={() => setIsAddUserDialogOpen(true)} >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>



                </div>
            </div>

            {/* User Type Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "CLIENT" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => dispatch(setActiveUserType("CLIENT"))}
                >
                    <Users className="h-4 w-4" />
                    Clients ({clients.length})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "CARE_WORKER" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => dispatch(setActiveUserType("CARE_WORKER"))}
                >
                    <UserPlus className="h-4 w-4" />
                    Care Workers ({careWorkers.length})
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeUserType === "OFFICE_STAFF" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    onClick={() => dispatch(setActiveUserType("OFFICE_STAFF"))}
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

                <Card className="shadow-none border-0">
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


        </div>
    )
}