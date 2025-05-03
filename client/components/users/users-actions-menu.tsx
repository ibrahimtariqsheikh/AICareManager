"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Edit, Trash, Mail, UserCog, Calendar, FileText } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { User, Role, SubRole } from "@/types/prismaTypes"

interface UserActionsMenuProps {
    user: User
    onDeleteUser?: (userId: string) => Promise<void>
}

export function UserActionsMenu({ user, onDeleteUser }: UserActionsMenuProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Format subrole for display
    const formatSubrole = (subrole?: SubRole) => {
        if (!subrole) return null
        return subrole.replace(/_/g, " ")
    }

    // Get badge color based on role
    const getRoleBadgeColor = (role: Role) => {
        switch (role) {
            case "CLIENT":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "CARE_WORKER":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "OFFICE_STAFF":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }


    const handleEditUser = () => {
        router.push(`/dashboard/users/edit/${user.id}`)
    }

    // Navigate to user profile page
    const handleViewProfile = () => {
        router.push(`/dashboard/users/profile/${user.id}`)
    }

    // Navigate to user schedule page
    const handleViewSchedule = () => {
        router.push(`/dashboard/users/schedule/${user.id}`)
    }

    // Handle user deletion
    const handleDeleteUser = async () => {
        if (!onDeleteUser) return

        setIsDeleting(true)
        try {
            await onDeleteUser(user.id)
            toast.success(`${user.fullName} has been deleted`)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Failed to delete user")
            console.error("Error deleting user:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle sending email
    const handleSendEmail = () => {
        window.location.href = `mailto:${user.email}`
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                            <span>User Actions</span>
                            {user.subRole && (
                                <Badge variant="outline" className={`text-xs font-normal ${getRoleBadgeColor(user.role)}`}>
                                    {formatSubrole(user.subRole)}
                                </Badge>
                            )}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewProfile}>
                        <UserCog className="mr-2 h-4 w-4" />
                        View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditUser}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSendEmail}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleViewSchedule}>
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                    </DropdownMenuItem>
                    {user.role === "CLIENT" && (
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/users/documents/${user.id}`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Documents
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {user.fullName}'s account and
                            remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

