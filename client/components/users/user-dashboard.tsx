"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Briefcase, Plus, Search } from 'lucide-react'
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { CustomInput } from "@/components/ui/custom-input"
import { Separator } from "../ui/separator"


export function UserDashboard() {
    // State
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
    const { theme } = useTheme()

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
        <div className="flex-1 px-4 sm:px-6 py-2 space-y-2">
            {/* User Type Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                <Tabs
                    defaultValue={activeUserType}
                    className="w-full"
                    onValueChange={(value) => dispatch(setActiveUserType(value as "CLIENT" | "CARE_WORKER" | "OFFICE_STAFF"))}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                        <TabsList className={`${theme === "dark" ? "bg-zinc-800" : "bg-neutral-100"} w-full sm:w-auto overflow-x-auto flex-nowrap`}>
                            <TabsTrigger value="CLIENT" className="flex items-center gap-2 whitespace-nowrap">
                                <Users className="h-4 w-4" />
                                Clients ({clients.length})
                            </TabsTrigger>
                            <TabsTrigger value="CARE_WORKER" className="flex items-center gap-2 whitespace-nowrap">
                                <UserPlus className="h-4 w-4" />
                                Care Workers ({careWorkers.length})
                            </TabsTrigger>
                            <TabsTrigger value="OFFICE_STAFF" className="flex items-center gap-2 whitespace-nowrap">
                                <Briefcase className="h-4 w-4" />
                                Office Staff ({officeStaff.length})
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex items-center w-full sm:w-auto">
                            <CustomInput
                                placeholder={`Search ${activeUserType === "CLIENT" ? "Client" : activeUserType === "OFFICE_STAFF" ? "Staff" : activeUserType === "CARE_WORKER" ? "Care Worker" : "User"}...`}
                                value={searchQuery}
                                onChange={(value: string) => setSearchQuery(value)}
                                className={`w-full sm:w-[200px] ${theme === "dark" ? "bg-zinc-800" : "bg-neutral-100/70"}`}
                                icon={<Search className="h-4 w-4" />}
                            />
                        </div>
                    </div>
                </Tabs>
            </div>

            <UserTableUser
                users={filteredUsers}
                isLoading={isLoadingUsers}
            />

            {/* Floating Action Button */}
            <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
                <Button
                    size="icon"
                    className={`rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg ${theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-primary hover:bg-primary/90"}`}
                    onClick={() => setIsAddUserDialogOpen(true)}
                >
                    <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
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