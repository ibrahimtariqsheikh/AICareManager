"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, Pencil, Phone, PlusCircle, Trash2, Save } from "lucide-react"
import { toast } from "sonner"
import type { KeyContact, Task, VisitType, User } from "@/types/prismaTypes"
import {
    useAddEmergencyContactMutation,
    useEditEmergencyContactMutation,
    useDeleteEmergencyContactMutation,
    useAddVisitTypeMutation,
    useAddVisitTypeTaskMutation,
} from "@/state/api"
import type { EmergencyContact } from "@/types/profileTypes"
import { useDispatch } from "react-redux"
import { useUpdateUserMutation } from "@/state/api"
import { updateUser as updateUserAction } from "@/state/slices/userSlice"
import { CustomInput } from "@/components/ui/custom-input"


// Define the form schema with Zod
const formSchema = z.object({
    preferredName: z.string().optional(),
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    phoneNumber: z.string().optional(),
    email: z.string().email({ message: "Please enter a valid email address." }),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    role: z.string(),
    subRole: z.string(),
    allergies: z.string().optional(),
    interests: z.string().optional(),
    history: z.string().optional(),
    languages: z.string().optional(),
    nhsNumber: z.string().optional(),
    mobility: z.string().optional(),
    likesDislikes: z.string().optional(),
    propertyAccess: z.string().optional(),
    dnraOrder: z.boolean().optional(),
})

export const PatientInformation = ({ user }: { user: User }) => {
    const dispatch = useDispatch()
    const [selectedRole, setSelectedRole] = useState<string>(user?.role || "CLIENT")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [newContact, setNewContact] = useState<Partial<KeyContact>>({
        name: "",
        relation: "",
        phone: "",
        email: "",
    })
    const [keyContacts, setKeyContacts] = useState<KeyContact[]>(user?.keyContacts || [])
    const [visitTypes, setVisitTypes] = useState<VisitType[]>(user?.visitTypes || [])
    const [visitDialogOpen, setVisitDialogOpen] = useState(false)
    const [taskDialogOpen, setTaskDialogOpen] = useState(false)
    const [selectedVisitType, setSelectedVisitType] = useState<string | null>(null)
    const [newVisitType, setNewVisitType] = useState<Partial<VisitType>>({
        name: "",
        description: "",
    })
    const [newTask, setNewTask] = useState<Partial<Task>>({
        type: "",
        careworkerNotes: "",
    })
    const [editingContact, setEditingContact] = useState<KeyContact | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [dateOfBirth, setDateOfBirth] = useState<Date>(
        user?.dateOfBirth ? preserveDateOnly(user.dateOfBirth) : new Date(),
    )
    const [isSaving, setIsSaving] = useState(false)
    const [updateUser] = useUpdateUserMutation()

    // API mutation hooks
    const [addEmergencyContact, { isLoading: isAddingContact }] = useAddEmergencyContactMutation()
    const [editEmergencyContact, { isLoading: isEditingContact }] = useEditEmergencyContactMutation()
    const [deleteEmergencyContact, { isLoading: isDeletingContact }] = useDeleteEmergencyContactMutation()
    const [addVisitType, { isLoading: isAddingVisitType }] = useAddVisitTypeMutation()
    const [addVisitTypeTask, { isLoading: isAddingTask }] = useAddVisitTypeTaskMutation()

    // Initialize the form with React Hook Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            preferredName: user?.preferredName || "",
            fullName: user?.fullName || "",
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
            address: user?.address || "",
            city: user?.city || "",
            province: user?.province || "",
            postalCode: user?.postalCode || "",
            role: user?.role || "CLIENT",
            subRole: user?.subRole || "SERVICE_USER",
            allergies: user?.allergies || "",
            interests: user?.interests || "",
            history: user?.history || "",
            languages: user?.languages || "",
            nhsNumber: user?.nhsNumber || "",
            mobility: user?.mobility || "",
            likesDislikes: user?.likesDislikes || "",
            propertyAccess: user?.propertyAccess || "",
            dnraOrder: user?.dnraOrder || false,
        },
    })

    // Update form values when user data changes
    useEffect(() => {
        if (user) {
            form.reset({
                preferredName: user.preferredName || "",
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                email: user.email || "",
                address: user.address || "",
                city: user.city || "",
                province: user.province || "",
                postalCode: user.postalCode || "",
                role: user.role || "CLIENT",
                subRole: user.subRole || "SERVICE_USER",
                allergies: user.allergies || "",
                interests: user.interests || "",
                history: user.history || "",
                languages: user.languages || "",
                nhsNumber: user.nhsNumber || "",
                mobility: user.mobility || "",
                likesDislikes: user.likesDislikes || "",
                propertyAccess: user.propertyAccess || "",
                dnraOrder: user.dnraOrder || false,
            })
        }
    }, [user, form])

    useEffect(() => {
        if (user?.dateOfBirth) {
            setDateOfBirth(preserveDateOnly(user.dateOfBirth))
        }
        if (user?.keyContacts) {
            setKeyContacts(user.keyContacts)
        }
        if (user?.visitTypes) {
            setVisitTypes(user.visitTypes)
        }
    }, [user?.dateOfBirth, user?.keyContacts, user?.visitTypes])

    function preserveDateOnly(dateString: string): Date {
        const dateParts = dateString.split("T")[0]?.split("-")
        if (!dateParts) {
            throw new Error("Invalid date string format")
        }
        const [year, month, day] = dateParts.map(Number)
        if (!year || !month || !day) {
            throw new Error("Invalid date string")
        }
        return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    }

    const formatDateForAPI = (date: Date): string => {
        // Format as YYYY-MM-DD with T00:00:00.000Z
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}T00:00:00.000Z`
    }

    // Form submission handler
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSaving(true)
        try {
            toast.loading("Updating patient information...")


            const updatedUser = {
                ...user,
                ...data,
                dateOfBirth: formatDateForAPI(dateOfBirth),
                keyContacts,
                visitTypes,
            }



            // Update Redux state
            dispatch(updateUserAction(updatedUser))



            toast.success("Patient information has been updated successfully.")
        } catch (error) {
            console.error("Error updating patient information:", error)
            toast.error(`Failed to update patient information. Please try again. ${error}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleEditContact = (contact: KeyContact) => {
        setEditingContact(contact)
        setEditDialogOpen(true)
    }

    const handleUpdateContact = async () => {
        if (!editingContact || !user?.id) return

        try {
            const result = await editEmergencyContact({
                userId: user.id,
                contactId: editingContact.id,
                contact: editingContact as EmergencyContact,
            }).unwrap()

            // Update local state with the returned contact
            const updatedContacts = keyContacts.map((contact: KeyContact) => (contact.id === result.id ? result : contact))
            setKeyContacts(updatedContacts)

            toast.success("Emergency contact has been updated successfully.")

            setEditingContact(null)
            setEditDialogOpen(false)
        } catch (error) {
            toast.error("Failed to update emergency contact. Please try again.")
            console.error("Failed to update contact:", error)
        }
    }

    const handleDeleteContact = async (contactId: string) => {
        if (!user?.id) return

        try {
            await deleteEmergencyContact({
                userId: user.id,
                contactId: contactId,
            }).unwrap()

            // Update local state
            const updatedContacts = keyContacts.filter((contact) => contact.id !== contactId)
            setKeyContacts(updatedContacts)

            toast.success("Emergency contact has been removed successfully.")
        } catch (error) {
            toast.error("Failed to delete emergency contact. Please try again.")
            console.error("Failed to delete contact:", error)
        }
    }

    const handleAddContact = async () => {
        if (!user?.id) return

        try {
            const newKeyContact = {
                name: newContact.name || "",
                relation: newContact.relation || "",
                phone: newContact.phone || "",
                email: newContact.email || "",
            }

            const result = await addEmergencyContact({
                userId: user.id,
                contact: newKeyContact as unknown as EmergencyContact,
            }).unwrap()

            // Update local state with the returned contact that includes the ID
            setKeyContacts([...keyContacts, result])

            toast.success("Emergency contact has been added successfully.")

            setNewContact({ name: "", relation: "", phone: "", email: "" })
            setDialogOpen(false)
        } catch (error) {
            toast.error("Failed to add emergency contact. Please try again.")
            console.error("Failed to add contact:", error)
        }
    }

    const handleAddVisitType = async () => {
        if (!user?.id) return

        try {
            const visitTypeData = {
                name: newVisitType.name || "",
                description: newVisitType.description || "",
            }

            const result = await addVisitType({
                userId: user.id,
                visitType: visitTypeData as VisitType,
            }).unwrap()

            // Update local state with the returned visit type
            setVisitTypes([...visitTypes, result])

            toast.success("New visit type has been created successfully.")

            setNewVisitType({ name: "", description: "" })
            setVisitDialogOpen(false)
        } catch (error) {
            toast.error("Failed to add visit type. Please try again.")
            console.error("Failed to add visit type:", error)
        }
    }

    const handleAddTask = async () => {
        if (!selectedVisitType || !user?.id) return

        try {
            const taskData = {
                type: newTask.type || "",
                careworkerNotes: newTask.careworkerNotes || "",
            }

            const result = await addVisitTypeTask({
                userId: user.id,
                visitTypeId: selectedVisitType,
                task: taskData as Task,
            }).unwrap()

            // Update local state
            const updatedVisitTypes = visitTypes.map((visitType) => {
                if (visitType.id === selectedVisitType) {
                    return {
                        ...visitType,
                        assignedTasks: [...(visitType.assignedTasks || []), result],
                    }
                }
                return visitType
            })

            setVisitTypes(updatedVisitTypes)

            toast.success("New task has been added to the visit type.")

            setNewTask({ type: "", careworkerNotes: "" })
            setTaskDialogOpen(false)
        } catch (error) {
            toast.error("Failed to add task. Please try again.")
            console.error("Failed to add task:", error)
        }
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>


                <Card className="p-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Patient Information</CardTitle>
                        <Button type="submit" className="flex items-center gap-2" disabled={isSaving}>
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardHeader>
                    <CardContent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm text-neutral-500">UserID</Label>
                                <CustomInput value={user?.id || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-neutral-500">Date of Birth</Label>
                                <DatePicker
                                    date={dateOfBirth}
                                    setDate={(newDate: Date) => {
                                        setDateOfBirth(newDate)
                                    }}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="preferredName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Preferred Name</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Preferred Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Full Name</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Full Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Contact Number</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Contact Number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Email Address</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Email Address" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Address</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Address" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">City</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="City" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Postal Code</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Postal Code" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Province</FormLabel>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="Province" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Role</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setSelectedRole(value)
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" className="text-neutral-900 font-medium" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(Role).map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subRole"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm text-neutral-500">Sub Role</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Sub Role" className="text-neutral-900 font-medium" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 mt-6">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <h3 className="text-md font-semibold mb-2">Allergies</h3>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="No allergies recorded" />


                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                    <FormItem>
                                        <h3 className="text-md font-semibold mb-2">Interests</h3>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="border-0 bg-transparent p-0 text-sm text-neutral-700"
                                                placeholder="No interests recorded"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="history"
                                render={({ field }) => (
                                    <FormItem>
                                        <h3 className="text-md font-semibold mb-2">Medical History</h3>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="No medical history recorded" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Two-column grid for Emergency Contacts and Additional Information */}
                <div className="grid grid-cols-1 gap-6 mt-6">
                    {/* Emergency Contacts Card */}
                    <Card className="p-6">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Emergency Contacts</CardTitle>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="sm" className="flex items-center gap-1">
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
                                            <Select
                                                value={newContact.relation}
                                                onValueChange={(value) => setNewContact({ ...newContact, relation: value })}
                                            >
                                                <SelectTrigger id="relation">
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                                    <SelectItem value="Parent">Parent</SelectItem>
                                                    <SelectItem value="Child">Child</SelectItem>
                                                    <SelectItem value="Sibling">Sibling</SelectItem>
                                                    <SelectItem value="Friend">Friend</SelectItem>
                                                    <SelectItem value="Caregiver">Caregiver</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contact@example.com"
                                                value={newContact.email}
                                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddContact}
                                            disabled={!newContact.name || !newContact.phone || isAddingContact}
                                        >
                                            {isAddingContact ? "Adding..." : "Add Contact"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {keyContacts && keyContacts.length > 0 ? (
                                <div className="space-y-4">
                                    {keyContacts.map((contact: KeyContact) => (
                                        <div
                                            key={contact.id}
                                            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-emerald-100 text-emerald-700 h-10 w-10 rounded-full flex items-center justify-center font-semibold">
                                                        {contact.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-md font-semibold">{contact.name}</h4>
                                                        <p className="text-sm text-neutral-600">{contact.relation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleEditContact(contact)}
                                                        disabled={isEditingContact || isDeletingContact}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        disabled={isEditingContact || isDeletingContact}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4 text-neutral-500" />
                                                    <span>{contact.phone}</span>
                                                </div>
                                                {contact.email && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-4 w-4 text-neutral-500" />
                                                        <span>{contact.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-neutral-500"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <p className="text-neutral-500 text-sm">No emergency contacts available.</p>
                                    <p className="text-neutral-400 text-xs mt-1">Add contacts using the button above.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Visit Types Card */}
                <Card className="p-6 mt-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Visit Types</CardTitle>
                        <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" size="sm" className="flex items-center gap-1">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Visit Type</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add Visit Type</DialogTitle>
                                    <DialogDescription>Create a new visit type for this patient.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="visit-name">Visit Name</Label>
                                        <Input
                                            id="visit-name"
                                            placeholder="e.g. Morning Visit, Medication Check"
                                            value={newVisitType.name}
                                            onChange={(e) => setNewVisitType({ ...newVisitType, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="visit-description">Description</Label>
                                        <Input
                                            id="visit-description"
                                            placeholder="Describe the purpose of this visit"
                                            value={newVisitType.description}
                                            onChange={(e) => setNewVisitType({ ...newVisitType, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setVisitDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddVisitType} disabled={!newVisitType.name || isAddingVisitType}>
                                        {isAddingVisitType ? "Adding..." : "Add Visit Type"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {visitTypes && visitTypes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {visitTypes.map((visitType) => (
                                    <div key={visitType.id} className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold">{visitType.name}</h3>
                                                <p className="text-sm text-neutral-600">{visitType.description}</p>
                                            </div>
                                            <Dialog
                                                open={taskDialogOpen && selectedVisitType === visitType.id}
                                                onOpenChange={(open) => {
                                                    setTaskDialogOpen(open)
                                                    if (open) setSelectedVisitType(visitType.id)
                                                    else setSelectedVisitType(null)
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                        <PlusCircle className="h-4 w-4" />
                                                        <span>Add Task</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Add Task to {visitType.name}</DialogTitle>
                                                        <DialogDescription>Add a new task to this visit type.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="task-type">Task Type</Label>
                                                            <Select
                                                                value={newTask.type}
                                                                onValueChange={(value) => setNewTask({ ...newTask, type: value })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select task type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="MEDICATION">Medication</SelectItem>
                                                                    <SelectItem value="HYGIENE">Hygiene</SelectItem>
                                                                    <SelectItem value="MEAL">Meal</SelectItem>
                                                                    <SelectItem value="EXERCISE">Exercise</SelectItem>
                                                                    <SelectItem value="SOCIAL">Social</SelectItem>
                                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="task-notes">Careworker Notes</Label>
                                                            <Input
                                                                id="task-notes"
                                                                placeholder="Instructions for careworkers"
                                                                value={newTask.careworkerNotes}
                                                                onChange={(e) => setNewTask({ ...newTask, careworkerNotes: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleAddTask} disabled={!newTask.type || isAddingTask}>
                                                            {isAddingTask ? "Adding..." : "Add Task"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        {/* Tasks List */}
                                        <div className="mt-3">
                                            <h4 className="text-sm font-medium mb-2">Assigned Tasks:</h4>
                                            {visitType.assignedTasks && visitType.assignedTasks.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {visitType.assignedTasks.map((task: Task) => (
                                                        <div key={task.id} className="bg-white p-3 rounded border border-neutral-200">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                    {task.type}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-neutral-700">{task.careworkerNotes || "No notes provided"}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-neutral-500">No tasks assigned to this visit type.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 text-sm">No visit types available. Add a visit type to get started.</p>
                        )}
                    </CardContent>
                </Card>
            </form>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Emergency Contact</DialogTitle>
                        <DialogDescription>Update the information for this emergency contact.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                placeholder="Full name"
                                value={editingContact?.name || ""}
                                onChange={(e) => setEditingContact(editingContact ? { ...editingContact, name: e.target.value } : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-relation">Relationship</Label>
                            <Select
                                value={editingContact?.relation || ""}
                                onValueChange={(value) =>
                                    setEditingContact(editingContact ? { ...editingContact, relation: value } : null)
                                }
                            >
                                <SelectTrigger id="edit-relation">
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Spouse">Spouse</SelectItem>
                                    <SelectItem value="Parent">Parent</SelectItem>
                                    <SelectItem value="Child">Child</SelectItem>
                                    <SelectItem value="Sibling">Sibling</SelectItem>
                                    <SelectItem value="Friend">Friend</SelectItem>
                                    <SelectItem value="Caregiver">Caregiver</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone Number</Label>
                            <Input
                                id="edit-phone"
                                placeholder="(555) 123-4567"
                                value={editingContact?.phone || ""}
                                onChange={(e) =>
                                    setEditingContact(editingContact ? { ...editingContact, phone: e.target.value } : null)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                placeholder="contact@example.com"
                                value={editingContact?.email || ""}
                                onChange={(e) =>
                                    setEditingContact(editingContact ? { ...editingContact, email: e.target.value } : null)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateContact}
                            disabled={!editingContact?.name || !editingContact?.phone || isEditingContact}
                        >
                            {isEditingContact ? "Updating..." : "Update Contact"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Form>
    )
}