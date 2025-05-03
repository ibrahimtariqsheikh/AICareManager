"use client"

import type React from "react"

import { useState } from "react"
import type { Role, SubRole } from "../../types/prismaTypes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { useAppSelector } from "@/state/redux"
import { CustomInput } from "../ui/custom-input"
import { CustomSelect } from "../ui/custom-select"

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
                        <DialogTitle>Add New {activeUserType === "CLIENT" ? "Client" : activeUserType === "CARE_WORKER" ? "Care Worker" : "Office Staff"}</DialogTitle>
                        <DialogDescription>Create a new user account. Assign a role and subrole to the user.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <CustomInput
                                        id="fullName"
                                        placeholder="Enter the full name of the user"
                                        type="text"
                                        value={fullName}
                                        onChange={setFullName}
                                        required

                                    />
                                </div>

                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <CustomInput id="email" type="email" value={email} onChange={setEmail} required placeholder="Enter the email of the user" />
                            </div>
                            {getSubroleOptions(activeUserType as Role).length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="subRole">Subrole</Label>
                                    <CustomSelect
                                        options={getSubroleOptions(activeUserType as Role).map((option) => ({
                                            value: option,
                                            label: option.replace(/_/g, " "),
                                        }))}
                                        onChange={(value: string) => setSubRole(value as SubRole)}
                                    />
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
