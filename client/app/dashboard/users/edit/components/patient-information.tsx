"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

import { useEffect, useState } from "react"

// Define types based on the provided data structure
type KeyContact = {
    id: string
    clientId?: string
    userId?: string
    name: string
    relation: string
    phone: string
    email?: string
}

type User = {
    id: string
    email: string
    fullName: string
    preferredName?: string
    role: string
    subRole: string
    address?: string
    city?: string
    province?: string
    postalCode?: string
    phoneNumber?: string
    dateOfBirth?: string
    allergies?: string
    interests?: string
    history?: string
    keyContacts?: KeyContact[]
    careOutcomes?: any[]
    incidentReports?: any[]
    riskAssessments?: any[]
    familyAccess?: any[]
    communicationLogs?: any[]
    documents?: any[]
    [key: string]: any
}

export const PatientInformation = ({ user }: { user: User }) => {
    const [selectedRole, setSelectedRole] = useState<string>(user?.role || "CLIENT")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [newContact, setNewContact] = useState<Partial<KeyContact>>({
        name: "",
        relation: "",
        phone: "",
    })
    const [keyContacts, setKeyContacts] = useState<KeyContact[]>(user?.keyContacts || [])

    useEffect(() => {
        if (user?.dateOfBirth) {
            setDateOfBirth(preserveDateOnly(user.dateOfBirth))
        }
        if (user?.keyContacts) {
            setKeyContacts(user.keyContacts)
        }
    }, [user?.dateOfBirth, user?.keyContacts])

    const preserveDateOnly = (dateString: string): Date => {
        if (!dateString) {
            throw new Error("Date string is undefined")
        }
        const [year, month, day] = dateString.split("T")[0].split("-").map(Number)
        if (!year || !month || !day) {
            throw new Error("Invalid date string")
        }
        return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    }

    const [dateOfBirth, setDateOfBirth] = useState<Date>(
        user?.dateOfBirth ? preserveDateOnly(user.dateOfBirth) : new Date(),
    )

    const formatDateForAPI = (date: Date): string => {
        // Format as YYYY-MM-DD with T00:00:00.000Z
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}T00:00:00.000Z`
    }

    const handleAddContact = () => {
        // In a real app, you would make an API call here
        const newKeyContact: KeyContact = {
            id: `temp-${Date.now()}`, // In a real app, the backend would generate this
            name: newContact.name || "",
            relation: newContact.relation || "",
            phone: newContact.phone || "",
            userId: user?.id || "",
        }

        setKeyContacts([...keyContacts, newKeyContact])
        setNewContact({ name: "", relation: "", phone: "" })
        setDialogOpen(false)
    }

    const Role = {
        SOFTWARE_OWNER: "SOFTWARE_OWNER",
        ADMIN: "ADMIN",
        CARE_WORKER: "CARE_WORKER",
        OFFICE_STAFF: "OFFICE_STAFF",
        CLIENT: "CLIENT",
        FAMILY: "FAMILY",
    }

    const SubRole = {
        //Office Staff
        FINANCE_MANAGER: "FINANCE_MANAGER",
        HR_MANAGER: "HR_MANAGER",
        CARE_MANAGER: "CARE_MANAGER",
        SCHEDULING_COORDINATOR: "SCHEDULING_COORDINATOR",
        OFFICE_ADMINISTRATOR: "OFFICE_ADMINISTRATOR",
        RECEPTIONIST: "RECEPTIONIST",
        QUALITY_ASSURANCE_MANAGER: "QUALITY_ASSURANCE_MANAGER",
        MARKETING_COORDINATOR: "MARKETING_COORDINATOR",
        COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
        //Care Worker
        CAREGIVER: "CAREGIVER",
        SENIOR_CAREGIVER: "SENIOR_CAREGIVER",
        JUNIOR_CAREGIVER: "JUNIOR_CAREGIVER",
        TRAINEE_CAREGIVER: "TRAINEE_CAREGIVER",
        LIVE_IN_CAREGIVER: "LIVE_IN_CAREGIVER",
        PART_TIME_CAREGIVER: "PART_TIME_CAREGIVER",
        SPECIALIZED_CAREGIVER: "SPECIALIZED_CAREGIVER",
        NURSING_ASSISTANT: "NURSING_ASSISTANT",
        //Client
        SERVICE_USER: "SERVICE_USER",
        FAMILY_AND_FRIENDS: "FAMILY_AND_FRIENDS",
        OTHER: "OTHER",
    }

    // Helper function to render array data sections
    const renderArraySection = (title: string, data: any[], emptyMessage: string) => {
        return (
            <Card className="p-6 mt-6">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.map((item, index) => (
                                <div key={item.id || index} className="bg-neutral-100 p-4 rounded-md shadow-sm">
                                    {Object.entries(item).map(([key, value]) => {
                                        if (key !== "id" && key !== "clientId" && key !== "userId") {
                                            return (
                                                <div key={key} className="mb-1">
                                                    <span className="text-xs font-medium text-neutral-500 capitalize">
                                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                                    </span>
                                                    <span className="text-sm ml-1">{String(value)}</span>
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-500 text-sm">{emptyMessage}</p>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card className="p-6">
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">UserID</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="UserID"
                                value={user?.id || ""}
                                readOnly
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Date of Birth</Label>
                            <DatePicker
                                date={dateOfBirth}
                                setDate={(newDate: Date) => {
                                    setDateOfBirth(newDate)
                                    // When saving to API, use formatDateForAPI(newDate)
                                    console.log("Date for API:", formatDateForAPI(newDate))
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Preferred Name</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Preferred Name"
                                value={user?.preferredName || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Full Name</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Full Name"
                                value={user?.fullName || ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Contact Number</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Contact Number"
                                value={user?.phoneNumber || ""}
                            />
                        </div>
                        <div className="space-y-2 ">
                            <Label className="text-sm text-neutral-500">Email Address</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Email Address"
                                value={user?.email || ""}
                            />
                        </div>
                        <div className="space-y-2 ">
                            <Label className="text-sm text-neutral-500">Address</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Address"
                                value={user?.address || ""}
                            />
                        </div>
                        <div className="space-y-2 ">
                            <Label className="text-sm text-neutral-500">City</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="City"
                                value={user?.city || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Postal Code</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Postal Code"
                                value={user?.postalCode || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Province</Label>
                            <Input
                                type="text"
                                className="text-md text-neutral-900 font-medium"
                                placeholder="Province"
                                value={user?.province || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Role</Label>
                            <Select value={selectedRole} onValueChange={(value: string) => setSelectedRole(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" className="text-neutral-900 font-medium" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Role).map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-neutral-500">Sub Role</Label>
                            <Select defaultValue={user?.subRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Sub Role" className="text-neutral-900 font-medium" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SubRole)
                                        .filter(([key]) => {
                                            if (selectedRole === "OFFICE_STAFF") {
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
                                                ].includes(key)
                                            }
                                            if (selectedRole === "CARE_WORKER") {
                                                return [
                                                    "CAREGIVER",
                                                    "SENIOR_CAREGIVER",
                                                    "JUNIOR_CAREGIVER",
                                                    "TRAINEE_CAREGIVER",
                                                    "LIVE_IN_CAREGIVER",
                                                    "PART_TIME_CAREGIVER",
                                                    "SPECIALIZED_CAREGIVER",
                                                    "NURSING_ASSISTANT",
                                                ].includes(key)
                                            }
                                            if (selectedRole === "CLIENT") {
                                                return ["SERVICE_USER", "FAMILY_AND_FRIENDS", "OTHER"].includes(key)
                                            }
                                            return false
                                        })
                                        .map(([key, value]) => (
                                            <SelectItem key={key} value={value}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Two-column grid for Emergency Contacts and Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Emergency Contacts Card */}
                <Card className="p-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Emergency Contacts</CardTitle>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Contact</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Emergency Contact</DialogTitle>
                                    <DialogDescription>
                                        Add a new emergency contact for this patient. Fill out the form below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Full name"
                                            value={newContact.name}
                                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="relation">Relationship</Label>
                                        <Input
                                            id="relation"
                                            placeholder="e.g. Spouse, Child, Parent"
                                            value={newContact.relation}
                                            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="(555) 123-4567"
                                            value={newContact.phone}
                                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddContact} disabled={!newContact.name || !newContact.phone}>
                                        Add Contact
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {keyContacts && keyContacts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {keyContacts.map((contact: KeyContact) => (
                                    <div key={contact.id} className="bg-neutral-100 p-4 rounded-md shadow-sm">
                                        <h4 className="text-md font-semibold mb-1">{contact.name}</h4>
                                        <p className="text-xs text-neutral-700">{contact.relation}</p>
                                        <p className="text-xs text-neutral-700">{contact.phone}</p>
                                        {contact.email && <p className="text-xs text-neutral-700">{contact.email}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 text-sm">No emergency contacts available.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Personal Details Card with Allergies, Interests, and History */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-md font-semibold mb-2">Allergies</h3>
                                <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                                    <p className="text-sm text-neutral-700">{user?.allergies || "No allergies recorded"}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-semibold mb-2">Interests</h3>
                                <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                                    <p className="text-sm text-neutral-700">{user?.interests || "No interests recorded"}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-semibold mb-2">Medical History</h3>
                                <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                                    <p className="text-sm text-neutral-700">{user?.history || "No medical history recorded"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional sections for arrays */}
            {renderArraySection("Care Outcomes", user?.careOutcomes || [], "No care outcomes available.")}
            {renderArraySection("Incident Reports", user?.incidentReports || [], "No incident reports available.")}
            {renderArraySection("Risk Assessments", user?.riskAssessments || [], "No risk assessments available.")}
            {renderArraySection("Family Access", user?.familyAccess || [], "No family access records available.")}
            {renderArraySection("Communication Logs", user?.communicationLogs || [], "No communication logs available.")}
            {renderArraySection("Documents", user?.documents || [], "No documents available.")}
        </>
    )
}
