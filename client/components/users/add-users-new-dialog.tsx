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

interface AddUsersNewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddUser: (
        fullName: string,
        agencyId: string,
        email: string,
        role: Role,
        subRole?: SubRole,
    ) => Promise<void>
    isCreatingUser: boolean
}

export function AddUsersNewDialog({ open, onOpenChange, onAddUser, isCreatingUser }: AddUsersNewDialogProps) {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [subRole, setSubRole] = useState<SubRole | undefined>(undefined)
    const { user } = useAppSelector((state) => state.user)

    const activeUserType = useAppSelector((state) => state.user.activeUserType)
    console.log("Active User Type", activeUserType)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onAddUser(fullName, user?.userInfo?.agencyId || "", email, activeUserType as Role, subRole)
        onOpenChange(false)
        setFullName("")
        setEmail("")
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
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="text-black border border-gray-300"
                                    />
                                </div>

                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            {getSubroleOptions(activeUserType as Role).length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="subRole">Subrole</Label>
                                    <Select value={(subRole || "")} onValueChange={(value: SubRole) => setSubRole(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subrole" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubroleOptions(activeUserType as Role).map((option) => (
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
        </>
    )
}
