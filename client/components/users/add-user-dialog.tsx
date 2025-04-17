"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Role, SubRole } from "../../types/prismaTypes"

interface AddUserDialogProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onAddUser: (email: string, role: Role, subRole?: SubRole) => void
    isLoading: boolean
}

export function AddUserDialog({ isOpen, setIsOpen, onAddUser, isLoading }: AddUserDialogProps) {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<Role>("CLIENT")
    const [subRole, setSubRole] = useState<SubRole | undefined>(undefined)

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
                    "COMPLIANCE_OFFICER"
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
                    "NURSING_ASSISTANT"
                ]
            case "CLIENT":
                return [
                    "SERVICE_USER",
                    "FAMILY_AND_FRIENDS",
                    "OTHER"
                ]
            default:
                return []
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAddUser(email, role, subRole)
        setEmail("")
        setRole("CLIENT")
        setSubRole(undefined)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to your agency. They will receive an invitation email to join.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value: Role) => {
                                setRole(value)
                                setSubRole(undefined) // Reset subrole when role changes
                            }}>
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
                            <div className="grid gap-2">
                                <Label htmlFor="subRole">Subrole</Label>
                                <Select value={subRole || ""} onValueChange={(value: SubRole) => setSubRole(value)}>
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
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Invitation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

