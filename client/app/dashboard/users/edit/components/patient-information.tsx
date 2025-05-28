"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
import { Mail, Pencil, Phone, PlusCircle, Trash2, Save, Pill, Briefcase, Upload, Award } from "lucide-react"
import { toast } from "sonner"
import { type KeyContact, type Task, type VisitType, type User } from "@/types/prismaTypes"
import {
    useAddEmergencyContactMutation,
    useEditEmergencyContactMutation,
    useDeleteEmergencyContactMutation,
    useAddVisitTypeMutation,
    useAddVisitTypeTaskMutation,
} from "@/state/api"
import type { EmergencyContact } from "@/types/profileTypes"
import { useAppDispatch } from "@/state/redux"
import { updateUser as updateUserAction } from "@/state/slices/userSlice"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { setActiveEditUserTab } from "@/state/slices/tabsSlice"
import { formatSubrole } from "@/utils/format-role"
import { MyCustomDateRange } from "@/app/dashboard/billing/components/my-custom-date-range"

enum TaskType {
    MEDICATION = "MEDICATION",
    BODYMAP = "BODYMAP",
    FOOD = "FOOD",
    DRINKS = "DRINKS",
    PERSONALCARE = "PERSONALCARE",
    HYGIENE = "HYGIENE",
    TOILET_ASSISTANCE = "TOILET_ASSISTANCE",
    REPOSITIONING = "REPOSITIONING",
    COMPANIONSHIP = "COMPANIONSHIP",
    LAUNDRY = "LAUNDRY",
    GROCERIES = "GROCERIES",
    HOUSEWORK = "HOUSEWORK",
    CHORES = "CHORES",
    INCIDENT_RESPONSE = "INCIDENT_RESPONSE",
    FIRE_SAFETY = "FIRE_SAFETY",
    BLOOD_PRESSURE = "BLOOD_PRESSURE",
    VITALS = "VITALS",
    OTHER = "OTHER",
}

interface SelectOption {
    label: string;
    value: string;
}

interface ContactMethod {
    id: string;
    type: string;
    label: string;
    value: string;
}

interface EmploymentHistory {
    id: string;
    employerName: string;
    role: string;
    startDate: string;
    endDate: string;
    summary: string;
}

interface Qualification {
    id: string;
    title: string;
    awardedDate: string;
    expiryDate: string;
    fileUrl: string;
}

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
    // Care Worker specific fields
    gender: z.string().optional(),
    nationalInsuranceNumber: z.string().optional(),
    nationality: z.string().optional(),
    rightToWorkStatus: z.string().optional(),
    dbsStatus: z.string().optional(),
    whatsapp: z.string().optional(),
    preferredContactMethod: z.string().optional(),
    timeAtAddress: z.string().optional(),
    employmentStartDate: z.string().optional(),
    employmentType: z.string().optional(),
    previousEmployers: z.string().optional(),
    reasonsForLeaving: z.string().optional(),
    references: z.string().optional(),
    careCertifications: z.string().optional(),
    trainingCompleted: z.string().optional(),
    certificationExpiryDates: z.string().optional(),
    highestQualification: z.string().optional(),
    institution: z.string().optional(),
    educationDates: z.string().optional(),
    rightToWorkDocument: z.string().optional(),
    proofOfId: z.string().optional(),
    dbsCertificate: z.string().optional(),
    insuranceDrivingLicense: z.string().optional(),
    documentExpiryDates: z.string().optional(),
    preferredShifts: z.string().optional(),
    daysAvailable: z.string().optional(),
    maxWeeklyHours: z.string().optional(),
    areasWillingToTravel: z.string().optional(),
    isDriver: z.boolean().optional(),
    internalComments: z.string().optional(),
    performanceNotes: z.string().optional(),
    disciplinaryRecords: z.string().optional(),
    linkedAlerts: z.string().optional(),
    // Original fields
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
    const dispatch = useAppDispatch()
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
    const [contactMethods, setContactMethods] = useState<ContactMethod[]>([])
    const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([])
    const [qualifications, setQualifications] = useState<Qualification[]>([])

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

    const addContactMethod = () => {
        setContactMethods([
            ...contactMethods,
            {
                id: crypto.randomUUID(),
                type: "EMAIL",
                label: "",
                value: ""
            }
        ])
    }

    const updateContactMethod = (id: string, field: keyof ContactMethod, value: string) => {
        setContactMethods(contactMethods.map(contact =>
            contact.id === id ? { ...contact, [field]: value } : contact
        ))
    }

    const removeContactMethod = (id: string) => {
        setContactMethods(contactMethods.filter(contact => contact.id !== id))
    }

    const addEmploymentHistory = () => {
        setEmploymentHistory([
            ...employmentHistory,
            {
                id: crypto.randomUUID(),
                employerName: "",
                role: "",
                startDate: "",
                endDate: "",
                summary: ""
            }
        ])
    }

    const updateEmploymentHistory = (id: string, field: keyof EmploymentHistory, value: string) => {
        setEmploymentHistory(employmentHistory.map(employment =>
            employment.id === id ? { ...employment, [field]: value } : employment
        ))
    }

    const removeEmploymentHistory = (id: string) => {
        setEmploymentHistory(employmentHistory.filter(employment => employment.id !== id))
    }

    const addQualification = () => {
        setQualifications([
            ...qualifications,
            {
                id: crypto.randomUUID(),
                title: "",
                awardedDate: "",
                expiryDate: "",
                fileUrl: ""
            }
        ])
    }

    const updateQualification = (id: string, field: keyof Qualification, value: string) => {
        setQualifications(qualifications.map(qualification =>
            qualification.id === id ? { ...qualification, [field]: value } : qualification
        ))
    }

    const removeQualification = (id: string) => {
        setQualifications(qualifications.filter(qualification => qualification.id !== id))
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
                <Card className="p-2 border border-neutral-200 duration-300  backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-md font-semibold text-neutral-800">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-neutral-600">UserID</Label>
                                <CustomInput value={user?.id || ""} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-normal text-neutral-600">Date of Birth</Label>
                                <MyCustomDateRange
                                    oneDate={true}
                                    initialDateRange={dateOfBirth ? { from: dateOfBirth, to: dateOfBirth } : undefined}
                                    onRangeChange={(range) => {
                                        if (range?.from) {
                                            setDateOfBirth(range.from)
                                        }
                                    }}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="preferredName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs font-normal text-neutral-600">Preferred Name</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Full Name</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Contact Number</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Email Address</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Address</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">City</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Postal Code</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Province</FormLabel>
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
                                        <FormLabel className="text-xs font-normal text-neutral-600">Role</FormLabel>
                                        <CustomSelect
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value)
                                                setSelectedRole(value)
                                            }}
                                            options={Object.values(Role).map((role) => ({
                                                label: role,
                                                value: role,
                                            }))}
                                            disabled
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subRole"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs font-normal text-neutral-600">Sub Role</FormLabel>
                                        <CustomSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={Object.entries(SubRole)
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
                                                .map(([_, value]) => ({
                                                    label: formatSubrole(value),
                                                    value: value,
                                                }))}
                                            placeholder="Select Sub Role"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {selectedRole === "CARE_WORKER" && (
                    <>
                        <Card className="p-2 mt-8 border border-neutral-200 hover: transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-md font-semibold text-neutral-800">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-normal text-neutral-600">Gender</FormLabel>
                                                <FormControl>
                                                    <CustomSelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={[
                                                            { label: "Male", value: "MALE" },
                                                            { label: "Female", value: "FEMALE" },
                                                            { label: "Other", value: "OTHER" },
                                                            { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" }
                                                        ] as SelectOption[]}
                                                        placeholder="Select gender"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nationalInsuranceNumber"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-normal text-neutral-600">National Insurance Number</FormLabel>
                                                <FormControl>
                                                    <CustomInput {...field} placeholder="e.g. AB123456C" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nationality"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-normal text-neutral-600">Nationality</FormLabel>
                                                <FormControl>
                                                    <CustomInput {...field} placeholder="e.g. British" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="rightToWorkStatus"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-normal text-neutral-600">Right to Work Status</FormLabel>
                                                <FormControl>
                                                    <CustomSelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={[
                                                            { label: "British Citizen", value: "BRITISH_CITIZEN" },
                                                            { label: "EU Citizen", value: "EU_CITIZEN" },
                                                            { label: "Work Visa", value: "WORK_VISA" },
                                                            { label: "Other", value: "OTHER" }
                                                        ]}
                                                        placeholder="Select status"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dbsStatus"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-normal text-neutral-600">DBS Status</FormLabel>
                                                <FormControl>
                                                    <CustomSelect
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        options={[
                                                            { label: "Enhanced", value: "ENHANCED" },
                                                            { label: "Standard", value: "STANDARD" },
                                                            { label: "Basic", value: "BASIC" },
                                                            { label: "Not Available", value: "NOT_AVAILABLE" }
                                                        ]}
                                                        placeholder="Select DBS status"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="p-2 mt-8 border border-neutral-200 hover: transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-md font-semibold text-neutral-800">Contact Information</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addContactMethod}
                                    className="border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Contact Method
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {contactMethods.map((contact) => (
                                        <div key={contact.id} className="bg-white p-4 rounded-lg border border-neutral-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Contact Type</Label>
                                                        <CustomSelect
                                                            value={contact.type}
                                                            onChange={(value) => updateContactMethod(contact.id, "type", value)}
                                                            options={[
                                                                { label: "Email", value: "EMAIL" },
                                                                { label: "Phone", value: "PHONE" },
                                                                { label: "WhatsApp", value: "WHATSAPP" },
                                                                { label: "Emergency Contact", value: "EMERGENCY" }
                                                            ] as SelectOption[]}
                                                            placeholder="Select contact type"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Label</Label>
                                                        <CustomInput
                                                            value={contact.label}
                                                            onChange={(value) => updateContactMethod(contact.id, "label", value)}
                                                            placeholder="e.g. Work Email, Mobile Phone"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Value</Label>
                                                        <CustomInput
                                                            value={contact.value}
                                                            onChange={(value) => updateContactMethod(contact.id, "value", value)}
                                                            placeholder="Enter contact details"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
                                                    onClick={() => removeContactMethod(contact.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {contactMethods.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                                                <Phone className="h-6 w-6 text-neutral-500" />
                                            </div>
                                            <p className="text-neutral-500 text-sm">No contact methods added yet.</p>
                                            <p className="text-neutral-400 text-xs mt-1">Add contact methods using the button above.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="p-2 mt-8 border border-neutral-200 hover: transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-md font-semibold text-neutral-800">Employment History</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addEmploymentHistory}
                                    className="border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Previous Employment
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {employmentHistory.map((employment) => (
                                        <div key={employment.id} className="bg-white p-4 rounded-lg border border-neutral-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Employer Name</Label>
                                                        <CustomInput
                                                            value={employment.employerName}
                                                            onChange={(value) => updateEmploymentHistory(employment.id, "employerName", value)}
                                                            placeholder="Enter employer name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Role/Job Title</Label>
                                                        <CustomInput
                                                            value={employment.role}
                                                            onChange={(value) => updateEmploymentHistory(employment.id, "role", value)}
                                                            placeholder="Enter job title"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Start Date</Label>
                                                        <MyCustomDateRange
                                                            oneDate={true}
                                                            initialDateRange={employment.startDate ? { from: new Date(employment.startDate), to: new Date(employment.startDate) } : undefined}
                                                            onRangeChange={(range) => {
                                                                if (range?.from) {
                                                                    updateEmploymentHistory(employment.id, "startDate", range.from.toISOString())
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">End Date</Label>
                                                        <MyCustomDateRange
                                                            oneDate={true}
                                                            initialDateRange={employment.endDate ? { from: new Date(employment.endDate), to: new Date(employment.endDate) } : undefined}
                                                            onRangeChange={(range) => {
                                                                if (range?.from) {
                                                                    updateEmploymentHistory(employment.id, "endDate", range.from.toISOString())
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Summary</Label>
                                                        <CustomInput
                                                            value={employment.summary}
                                                            onChange={(value) => updateEmploymentHistory(employment.id, "summary", value)}
                                                            placeholder="Enter employment summary (optional)"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
                                                    onClick={() => removeEmploymentHistory(employment.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {employmentHistory.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                                                <Briefcase className="h-6 w-6 text-neutral-500" />
                                            </div>
                                            <p className="text-neutral-500 text-sm">No employment history added yet.</p>
                                            <p className="text-neutral-400 text-xs mt-1">Add previous employment using the button above.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="p-2 mt-8 border border-neutral-200 hover: transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-md font-semibold text-neutral-800">Qualifications & Certifications</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addQualification}
                                    className="border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Qualification
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {qualifications.map((qualification) => (
                                        <div key={qualification.id} className="bg-white p-4 rounded-lg border border-neutral-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Title</Label>
                                                        <CustomInput
                                                            value={qualification.title}
                                                            onChange={(value) => updateQualification(qualification.id, "title", value)}
                                                            placeholder="Enter qualification title"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Awarded Date</Label>
                                                        <MyCustomDateRange
                                                            oneDate={true}
                                                            initialDateRange={qualification.awardedDate ? { from: new Date(qualification.awardedDate), to: new Date(qualification.awardedDate) } : undefined}
                                                            onRangeChange={(range) => {
                                                                if (range?.from) {
                                                                    updateQualification(qualification.id, "awardedDate", range.from.toISOString())
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Expiry Date (Optional)</Label>
                                                        <MyCustomDateRange
                                                            oneDate={true}
                                                            initialDateRange={qualification.expiryDate ? { from: new Date(qualification.expiryDate), to: new Date(qualification.expiryDate) } : undefined}
                                                            onRangeChange={(range) => {
                                                                if (range?.from) {
                                                                    updateQualification(qualification.id, "expiryDate", range.from.toISOString())
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-normal text-neutral-600">Certificate File</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    // Handle file upload
                                                                    console.log("File upload clicked")
                                                                }}
                                                            >
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                Upload Certificate
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
                                                    onClick={() => removeQualification(qualification.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {qualifications.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                                                <Award className="h-6 w-6 text-neutral-500" />
                                            </div>
                                            <p className="text-neutral-500 text-sm">No qualifications added yet.</p>
                                            <p className="text-neutral-400 text-xs mt-1">Add qualifications using the button above.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                <Card className="p-2 mt-8  border border-neutral-200 hover: transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md font-semibold text-neutral-800">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                    <FormItem>
                                        <h3 className="text-xs font-normal text-neutral-600">Allergies</h3>
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
                                        <h3 className="text-xs font-normal text-neutral-600">Interests</h3>
                                        <FormControl>
                                            <CustomInput {...field} placeholder="No interests recorded" />
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
                                        <h3 className="text-xs font-normal text-neutral-600">Medical History</h3>
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
                <div className="grid grid-cols-1 gap-2 mt-6">
                    {/* Emergency Contacts Card */}
                    <Card className="p-2  border border-neutral-200 hover: transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-md font-semibold text-neutral-800">Emergency Contacts</CardTitle>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800"
                                    >
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
                                            <Label htmlFor="name" className="text-xs font-normal text-neutral-600">Name</Label>
                                            <CustomInput
                                                id="name"
                                                placeholder="Full name"
                                                value={newContact.name}
                                                onChange={(value) => setNewContact({ ...newContact, name: value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="relation" className="text-xs font-normal text-neutral-600">Relationship</Label>
                                            <CustomSelect
                                                value={newContact.relation}
                                                onChange={(value) => setNewContact({ ...newContact, relation: value })}
                                                options={[
                                                    { label: "Spouse", value: "Spouse" },
                                                    { label: "Parent", value: "Parent" },
                                                    { label: "Child", value: "Child" },
                                                    { label: "Sibling", value: "Sibling" },
                                                    { label: "Friend", value: "Friend" },
                                                    { label: "Caregiver", value: "Caregiver" },
                                                    { label: "Other", value: "Other" }
                                                ]}
                                                placeholder="Select relationship"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-normal text-neutral-600">Phone Number</Label>
                                            <CustomInput
                                                id="phone"
                                                placeholder="(555) 123-4567"
                                                value={newContact.phone}
                                                onChange={(value) => setNewContact({ ...newContact, phone: value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-normal text-neutral-600">Email Address</Label>
                                            <CustomInput
                                                id="email"
                                                type="email"
                                                placeholder="contact@example.com"
                                                value={newContact.email}
                                                onChange={(value) => setNewContact({ ...newContact, email: value })}
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
                                            className="bg-white p-4 rounded-lg border border-neutral-200  hover: transition-all duration-300 hover:border-blue-200"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 text-blue-700 h-10 w-10 rounded-full flex items-center justify-center font-semibold">
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
                <Card className="p-2 mt-8  border border-neutral-200 hover: transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-md font-semibold text-neutral-800">Visit Types</CardTitle>
                        <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800"
                                >
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
                                        <Label htmlFor="visit-name" className="text-xs font-normal text-neutral-600">Visit Name</Label>
                                        <CustomInput
                                            id="visit-name"
                                            placeholder="e.g. Morning Visit, Medication Check"
                                            value={newVisitType.name}
                                            onChange={(value) => setNewVisitType({ ...newVisitType, name: value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="visit-description" className="text-xs font-normal text-neutral-600">Description</Label>
                                        <CustomInput
                                            id="visit-description"
                                            placeholder="Describe the purpose of this visit"
                                            value={newVisitType.description}
                                            onChange={(value) => setNewVisitType({ ...newVisitType, description: value })}
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
                            <div className="grid grid-cols-1 gap-2">
                                {visitTypes.map((visitType) => (
                                    <div
                                        key={visitType.id}
                                        className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 hover: transition-all duration-300"
                                    >
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
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                                                    >
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
                                                            <Label htmlFor="task-type" className="text-xs font-normal text-neutral-600">Task Type</Label>
                                                            <CustomSelect
                                                                value={newTask.type}
                                                                onChange={(value) => setNewTask({ ...newTask, type: value })}
                                                                options={Object.values(TaskType).map((type) => ({
                                                                    label: type,
                                                                    value: type,
                                                                }))}
                                                                placeholder="Select task type"
                                                            />
                                                        </div>
                                                        {/* <div className="space-y-2">
                                                            <Label htmlFor="task-notes">Careworker Notes</Label>
                                                            <Input
                                                                id="task-notes"
                                                                placeholder="Instructions for careworkers"
                                                                value={newTask.careworkerNotes}
                                                                onChange={(e) => setNewTask({ ...newTask, careworkerNotes: e.target.value })}
                                                            />
                                                        </div> */}
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
                                                        <div
                                                            key={task.id}
                                                            className="bg-white p-3 rounded-md border border-neutral-200 hover:border-blue-200 transition-colors duration-300"
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium ">
                                                                    {task.type}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-neutral-700">{task.careworkerNotes || "No notes provided"}</p>

                                                            {task.type === "MEDICATION" && (
                                                                <div className="mt-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-full text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                                                                        onClick={() => {
                                                                            try {
                                                                                dispatch(setActiveEditUserTab("emar"))
                                                                            } catch (error) {
                                                                                console.error("Error switching to EMAR tab:", error)
                                                                                toast.error("Failed to switch to Medications tab")
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Pill className="h-3.5 w-3.5 mr-1" />
                                                                        Manage Medications
                                                                    </Button>
                                                                </div>
                                                            )}
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
                            <Label htmlFor="edit-name" className="text-xs font-normal text-neutral-600">Name</Label>
                            <CustomInput
                                id="edit-name"
                                placeholder="Full name"
                                value={editingContact?.name || ""}
                                onChange={(value) => setEditingContact(editingContact ? { ...editingContact, name: value } : null)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-relation" className="text-xs font-normal text-neutral-600">Relationship</Label>
                            <CustomSelect
                                value={editingContact?.relation || ""}
                                onChange={(value) =>
                                    setEditingContact(editingContact ? { ...editingContact, relation: value } : null)
                                }
                                options={[
                                    { label: "Spouse", value: "Spouse" },
                                    { label: "Parent", value: "Parent" },
                                    { label: "Child", value: "Child" },
                                    { label: "Sibling", value: "Sibling" },
                                    { label: "Friend", value: "Friend" },
                                    { label: "Caregiver", value: "Caregiver" },
                                    { label: "Other", value: "Other" }
                                ]}
                                placeholder="Select relationship"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone" className="text-xs font-normal text-neutral-600">Phone Number</Label>
                            <CustomInput
                                id="edit-phone"
                                placeholder="(555) 123-4567"
                                value={editingContact?.phone || ""}
                                onChange={(value) =>
                                    setEditingContact(editingContact ? { ...editingContact, phone: value } : null)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email" className="text-xs font-normal text-neutral-600">Email Address</Label>
                            <CustomInput
                                id="edit-email"
                                type="email"
                                placeholder="contact@example.com"
                                value={editingContact?.email || ""}
                                onChange={(value) =>
                                    setEditingContact(editingContact ? { ...editingContact, email: value } : null)
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
            <div className="flex justify-end mt-4">
                <Button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                    disabled={isSaving}
                >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </Form>
    )
}
