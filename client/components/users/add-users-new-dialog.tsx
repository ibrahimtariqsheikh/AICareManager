"use client"

import type React from "react"

import { useState } from "react"
import type { Role, SubRole } from "../../types/prismaTypes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useAppSelector } from "@/state/redux"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"

interface AddUsersNewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddUser: (
        firstName: string,
        lastName: string,
        agencyId: string,
        email: string,
        role: Role,
        subRole?: SubRole,
    ) => Promise<void>
    isCreatingUser: boolean
}

export function AddUsersNewDialog({ open, onOpenChange, onAddUser, isCreatingUser }: AddUsersNewDialogProps) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<Role>("CLIENT")
    const [subRole, setSubRole] = useState<SubRole | undefined>(undefined)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const { user } = useAppSelector((state) => state.user)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setShowConfirmDialog(true)
    }

    const handleConfirm = async () => {
        await onAddUser(firstName, lastName, user?.userInfo?.agencyId || "", email, role, subRole)
        setShowConfirmDialog(false)
        setFirstName("")
        setLastName("")
        setEmail("")
        setRole("CLIENT")
        setSubRole(undefined)
    }

    const getSubroleOptions = (role: Role): SubRole[] => {
        switch (role) {
            case "OFFICE_STAFF":
                return [
                    "FINANCE_MANAGER",
                    "HR_MANAGER",
                    "CARE_MANAGER",
                    "SCHEDULING_COORDINATOR",
                    "OFFICE_ADMINISTRATOR",
                    "RECEPTIONIST",
                    "QUALITY_ASSURANCE_MANAGER",
                    "MARKETING_COORDINATOR",
                    "COMPLIANCE_OFFICER",
                ]
            case "CARE_WORKER":
                return [
                    "CAREGIVER",
                    "SENIOR_CAREGIVER",
                    "JUNIOR_CAREGIVER",
                    "TRAINEE_CAREGIVER",
                    "LIVE_IN_CAREGIVER",
                    "PART_TIME_CAREGIVER",
                    "SPECIALIZED_CAREGIVER",
                    "NURSING_ASSISTANT",
                ]
            case "CLIENT":
                return ["SERVICE_USER", "FAMILY_AND_FRIENDS", "OTHER"]
            default:
                return []
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account. Assign a role and subrole to the user.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="text-black border border-gray-300"
                                    />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="text-black border border-gray-300"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(value: Role) => {
                                        setRole(value)
                                        setSubRole(undefined) // Reset subrole when role changes
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLIENT">Client</SelectItem>
                                        <SelectItem value="CARE_WORKER">Care Worker</SelectItem>
                                        <SelectItem value="OFFICE_STAFF">Office Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {getSubroleOptions(role).length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="subRole">Subrole</Label>
                                    <Select value={subRole} onValueChange={(value: SubRole) => setSubRole(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subrole" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubroleOptions(role).map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option.replace(/_/g, " ")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreatingUser}>
                                {isCreatingUser ? "Creating..." : "Create User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm User Creation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to create a new user with the following details?
                            <div className="mt-2">
                                <p><strong>Name:</strong> {firstName} {lastName}</p>
                                <p><strong>Email:</strong> {email}</p>
                                <p><strong>Role:</strong> {role}</p>
                                {subRole && <p><strong>Subrole:</strong> {subRole.replace(/_/g, " ")}</p>}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={isCreatingUser}>
                            {isCreatingUser ? "Creating..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

