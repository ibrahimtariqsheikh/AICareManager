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


            {/* User Type Tabs */}
            <div className="flex border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
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
                    <Button onClick={() => setIsAddUserDialogOpen(true)} >
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>


            </div>

            {/* User Content */}
            <div className="space-y-4">


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