"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    FileText,
    Heart,
    Home,
    Languages,
    LifeBuoy,
    Phone,
    Plus,
    Save,
    Settings,
    ShieldAlert,
    Trash,
    Upload,
    User,
    UserCog,
    X,
    Mail,
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import type { User as UserType } from "@/types/prismaTypes"
import type { EmergencyContact, Medication, RiskAssessment, Document } from "@/types/profileTypes"
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/state/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

// Define Role and SubRole types
type Role = "SOFTWARE_OWNER" | "ADMIN" | "CARE_WORKER" | "OFFICE_STAFF" | "CLIENT" | "FAMILY"
type SubRole =
    | "FINANCE_MANAGER"
    | "HR_MANAGER"
    | "CARE_MANAGER"
    | "SCHEDULING_COORDINATOR"
    | "OFFICE_ADMINISTRATOR"
    | "RECEPTIONIST"
    | "QUALITY_ASSURANCE_MANAGER"
    | "MARKETING_COORDINATOR"
    | "COMPLIANCE_OFFICER"
    | "CAREGIVER"
    | "SENIOR_CAREGIVER"
    | "JUNIOR_CAREGIVER"
    | "TRAINEE_CAREGIVER"
    | "LIVE_IN_CAREGIVER"
    | "PART_TIME_CAREGIVER"
    | "SPECIALIZED_CAREGIVER"
    | "NURSING_ASSISTANT"
    | "SERVICE_USER"
    | "FAMILY_AND_FRIENDS"
    | "OTHER"

// Form Schemas
const basicInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["SOFTWARE_OWNER", "ADMIN", "CARE_WORKER", "OFFICE_STAFF", "CLIENT", "FAMILY"]),
    subRole: z.enum([
        // Office staff subroles
        "FINANCE_MANAGER",
        "HR_MANAGER",
        "CARE_MANAGER",
        "SCHEDULING_COORDINATOR",
        "OFFICE_ADMINISTRATOR",
        "RECEPTIONIST",
        "QUALITY_ASSURANCE_MANAGER",
        "MARKETING_COORDINATOR",
        "COMPLIANCE_OFFICER",
        // Care worker subroles
        "CAREGIVER",
        "SENIOR_CAREGIVER",
        "JUNIOR_CAREGIVER",
        "TRAINEE_CAREGIVER",
        "LIVE_IN_CAREGIVER",
        "PART_TIME_CAREGIVER",
        "SPECIALIZED_CAREGIVER",
        "NURSING_ASSISTANT",
        // Client subroles
        "SERVICE_USER",
        "FAMILY_AND_FRIENDS",
        "OTHER"
    ]).optional(),
    agencyId: z.string().optional()
})

const addressSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
})

const contactSchema = z.object({
    phone: z.string().optional(),
    alternatePhone: z.string().optional(),
})

const emergencyContactSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    phone: z.string().min(1, {
        message: "Phone number is required",
    }),
    relationship: z.string().optional(),
})

const medicationSchema = z.object({
    name: z.string().min(1, {
        message: "Medication name is required",
    }),
    dosage: z.string().min(1, {
        message: "Dosage is required",
    }),
    type: z.string().optional(),
    frequency: z.string().optional(),
    notes: z.string().optional(),
})

const medicalInfoSchema = z.object({
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    medicalNotes: z.string().optional(),
})

const preferencesSchema = z.object({
    language: z.string().optional(),
    secondaryLanguage: z.string().optional(),
    timezone: z.string().optional(),
    notificationPreferences: z.string().optional(),
    interests: z.string().optional(),
    hobbies: z.string().optional(),
    dietaryRequirements: z.string().optional(),
})

const riskAssessmentSchema = z.object({
    category: z.string().optional(),
    description: z.string().optional(),
    affectedParties: z.string().optional(),
    managementPlan: z.string().optional(),
    likelihood: z.string().optional(),
    severity: z.string().optional(),
})

const documentSchema = z.object({
    name: z.string().min(1, {
        message: "Document name is required",
    }),
    type: z.string().min(1, {
        message: "Document type is required",
    }),
    uploadDate: z.string().optional(),
    file: z.any().optional(),
})

export default function EditUserPage() {
    const router = useRouter()
    const { id } = useParams()
    const userId = id as string
    const [updateUser] = useUpdateUserMutation()
    const [isSaving, setIsSaving] = useState(false)

    // State
    const [formData, setFormData] = useState<Partial<UserType>>({})
    const [activeTab, setActiveTab] = useState("basic")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // New state for managing contacts, family access, medications, and documents
    const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })
    const [newFamilyAccess, setNewFamilyAccess] = useState({ name: "", phone: "", relationship: "" })
    const [newMedication, setNewMedication] = useState({ name: "", dosage: "", type: "", frequency: "", notes: "" })
    const [newDocument, setNewDocument] = useState({
        name: "",
        type: "",
        uploadDate: new Date().toISOString().split("T")[0],
    })
    const [showNewContactForm, setShowNewContactForm] = useState(false)
    const [showNewMedicationForm, setShowNewMedicationForm] = useState(false)
    const [showNewDocumentForm, setShowNewDocumentForm] = useState(false)

    // Queries
    const { data: userData } = useGetUserByIdQuery(userId || "", { skip: !userId })

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (userData?.data) {
            setFormData(userData.data)
        }
    }, [userData])

    // Track unsaved changes
    useEffect(() => {
        if (userData?.data && formData && Object.keys(formData).length > 0) {
            setHasUnsavedChanges(JSON.stringify(userData.data) !== JSON.stringify(formData))
        }
    }, [userData, formData])

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [hasUnsavedChanges])

    // Handle input change
    const handleInputChange = (name: string, value: string) => {
        if (name.includes(".")) {
            // Handle nested properties
            const [parent, child] = name.split(".")
            setFormData((prev: Partial<UserType>) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [parent]: {
                        ...(prev.profile?.[parent] || {}),
                        [child]: value,
                    },
                },
            }))
        } else {
            // Handle direct properties
            setFormData((prev: Partial<UserType>) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    // Handle profile input change
    const handleProfileChange = (field: string, value: any) => {
        setFormData((prev: Partial<UserType>) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value,
            },
        }))
    }

    // Get subrole options based on role
    const getSubroleOptions = (role?: Role): SubRole[] => {
        if (!role) return []

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

    // Format role name for display
    const formatRoleName = (role?: string) => {
        if (!role) return ""
        return role.replace(/_/g, " ")
    }

    // Get role badge color
    const getRoleBadgeColor = (role?: string) => {
        if (!role) return ""

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

    // Form hooks
    const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "CLIENT" as Role,
            subRole: undefined,
            agencyId: undefined
        }
    })

    const addressForm = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            address: formData.profile?.address || "",
            city: formData.profile?.city || "",
            state: formData.profile?.state || "",
            zipCode: formData.profile?.zipCode || "",
            country: formData.profile?.country || "",
        },
    })

    const contactForm = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            phone: formData.profile?.phone || "",
            alternatePhone: formData.profile?.alternatePhone || "",
        },
    })

    const emergencyContactForm = useForm<z.infer<typeof emergencyContactSchema>>({
        resolver: zodResolver(emergencyContactSchema),
        defaultValues: {
            name: "",
            phone: "",
            relationship: "",
        },
    })

    const medicationForm = useForm<z.infer<typeof medicationSchema>>({
        resolver: zodResolver(medicationSchema),
        defaultValues: {
            name: "",
            dosage: "",
            type: "",
            frequency: "",
            notes: "",
        },
    })

    const medicalInfoForm = useForm<z.infer<typeof medicalInfoSchema>>({
        resolver: zodResolver(medicalInfoSchema),
        defaultValues: {
            allergies: formData.profile?.allergies || "",
            medicalConditions: formData.profile?.medicalConditions || "",
            medicalNotes: formData.profile?.medicalNotes || "",
        },
    })

    const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            language: formData.profile?.language || "",
            secondaryLanguage: formData.profile?.secondaryLanguage || "",
            timezone: formData.profile?.timezone || "",
            notificationPreferences: formData.profile?.notificationPreferences || "",
            interests: formData.profile?.interests || "",
            hobbies: formData.profile?.hobbies || "",
            dietaryRequirements: formData.profile?.dietaryRequirements || "",
        },
    })

    const riskAssessmentForm = useForm<z.infer<typeof riskAssessmentSchema>>({
        resolver: zodResolver(riskAssessmentSchema),
        defaultValues: {
            category: "",
            description: "",
            affectedParties: "",
            managementPlan: "",
            likelihood: "",
            severity: "",
        },
    })

    const documentForm = useForm<z.infer<typeof documentSchema>>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            name: "",
            type: "",
            uploadDate: new Date().toISOString().split("T")[0],
        },
    })

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (userData?.data) {
            basicInfoForm.reset({
                firstName: userData.data.firstName,
                lastName: userData.data.lastName,
                email: userData.data.email,
                role: userData.data.role as Role,
                subRole: userData.data.subRole as SubRole | undefined,
                agencyId: userData.data.agencyId || "",
            });
        }
    }, [userData, basicInfoForm]);

    const handleSubmit = basicInfoForm.handleSubmit(async (data) => {
        setIsSaving(true)
        try {
            await updateUser({
                id: userId,
                ...data
            }).unwrap()
            toast.success("User updated successfully")
            router.push('/dashboard/users')
        } catch (error) {
            console.error("Error updating user:", error)
            toast.error("Failed to update user")
        } finally {
            setIsSaving(false)
        }
    })

    if (!userId) {
        return null // Will be redirected by useEffect
    }

    if (isSaving) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <LoadingSpinner />
                        <p className="text-lg font-medium">Saving user data...</p>
                    </div>
                </Card>
            </div>
        )
    }

    if (!userData?.data) {
        return (
            <div className="container mx-auto py-10">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-center">User Not Found</CardTitle>
                        <CardDescription className="text-center">
                            The user you are looking for does not exist or you don't have permission to view it.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push("/dashboard/users")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const user = userData.data

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage src={user.profile?.avatarUrl || ""} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </h1>
                            <Badge className={getRoleBadgeColor(user.role)}>{formatRoleName(user.role)}</Badge>
                        </div>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={() => router.back()} className="flex-1 md:flex-none">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button type="submit" form="basicInfoForm" disabled={isSaving} className="flex-1 md:flex-none">
                        {isSaving ? (
                            <>
                                <LoadingSpinner className="mr-2 h-4 w-4" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {hasUnsavedChanges && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6 flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>You have unsaved changes. Don't forget to save before leaving this page.</p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-300 hover:bg-amber-100"
                        onClick={handleSubmit}
                        disabled={isSaving}
                    >
                        Save Now
                    </Button>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} id="basicInfoForm" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center">
                                    <UserCog className="h-5 w-5 mr-2 text-primary" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                            <AvatarImage src={user.profile?.avatarUrl || ""} alt={`${user.firstName} ${user.lastName}`} />
                                            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                                {user.firstName?.[0]}
                                                {user.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">User ID</Label>
                                        <p className="text-sm font-mono bg-muted p-1 rounded">{user.id}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Created</Label>
                                        <p className="text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Last Updated</Label>
                                        <p className="text-sm">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={formData.status || "Active"}
                                            onValueChange={(value) => handleInputChange("status", value)}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                                        Active
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Inactive">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                                                        Inactive
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Pending">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                                                        Pending
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="role">Role</Label>
                                        <Select
                                            value={formData.role || ""}
                                            onValueChange={(value: Role) => {
                                                handleInputChange("role", value)
                                                // Reset subrole when role changes
                                                setFormData((prev: Partial<UserType>) => ({ ...prev, subRole: undefined }))
                                            }}
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CLIENT">Client</SelectItem>
                                                <SelectItem value="CARE_WORKER">Care Worker</SelectItem>
                                                <SelectItem value="OFFICE_STAFF">Office Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="subRole">Subrole</Label>
                                        <Select
                                            value={formData.subRole || ""}
                                            onValueChange={(value) => handleInputChange("subRole", value)}
                                        >
                                            <SelectTrigger id="subRole">
                                                <SelectValue placeholder="Select subrole" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getSubroleOptions(formData.role as Role).map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {formatRoleName(option)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Separator />

                                <Button
                                    variant="destructive"
                                    type="button"
                                    className="w-full"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete User
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-primary" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.push(`/users/profile/${userId}`)}
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    View Profile
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => router.push(`/users/schedule/${userId}`)}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Schedule
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => (window.location.href = `mailto:${user.email}`)}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader className="pb-4">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                                        <TabsTrigger value="basic" className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <span className="hidden md:inline">Basic</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="contact" className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            <span className="hidden md:inline">Contact</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="medical" className="flex items-center gap-1">
                                            <Heart className="h-4 w-4" />
                                            <span className="hidden md:inline">Medical</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="preferences" className="flex items-center gap-1">
                                            <Settings className="h-4 w-4" />
                                            <span className="hidden md:inline">Preferences</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="risk" className="flex items-center gap-1">
                                            <ShieldAlert className="h-4 w-4" />
                                            <span className="hidden md:inline">Risk</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="documents" className="flex items-center gap-1">
                                            <FileText className="h-4 w-4" />
                                            <span className="hidden md:inline">Documents</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="basic" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <User className="h-5 w-5 mr-2 text-primary" />
                                                    Basic Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...basicInfoForm}>
                                                    <form onSubmit={handleSubmit} className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="firstName"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>First Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="lastName"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Last Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Email Address</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="email" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="role"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Role</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Select role" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    <SelectItem value="CLIENT">Client</SelectItem>
                                                                                    <SelectItem value="CARE_WORKER">Care Worker</SelectItem>
                                                                                    <SelectItem value="OFFICE_STAFF">Office Staff</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="subRole"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Subrole</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <FormControl>
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Select subrole" />
                                                                                    </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                    {getSubroleOptions(basicInfoForm.getValues("role")).map((option) => (
                                                                                        <SelectItem key={option} value={option}>
                                                                                            {formatRoleName(option)}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={basicInfoForm.control}
                                                                name="agencyId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Agency ID</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="contact" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <Home className="h-5 w-5 mr-2 text-primary" />
                                                    Address Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...addressForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="address"
                                                                render={({ field }) => (
                                                                    <FormItem className="md:col-span-2">
                                                                        <FormLabel>Street Address</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="city"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>City</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="state"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>State/Province</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="zipCode"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Postal/Zip Code</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={addressForm.control}
                                                                name="country"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Country</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <Phone className="h-5 w-5 mr-2 text-primary" />
                                                    Contact Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...contactForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={contactForm.control}
                                                                name="phone"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Primary Phone</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={contactForm.control}
                                                                name="alternatePhone"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Alternate Phone</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <LifeBuoy className="h-5 w-5 mr-2 text-primary" />
                                                    Emergency Contacts
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...emergencyContactForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={emergencyContactForm.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={emergencyContactForm.control}
                                                                name="phone"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Phone</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={emergencyContactForm.control}
                                                                name="relationship"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Relationship</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="medical" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <Heart className="h-5 w-5 mr-2 text-primary" />
                                                    Medications
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...medicationForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={medicationForm.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicationForm.control}
                                                                name="dosage"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Dosage</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicationForm.control}
                                                                name="type"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Type</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicationForm.control}
                                                                name="frequency"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Frequency</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicationForm.control}
                                                                name="notes"
                                                                render={({ field }) => (
                                                                    <FormItem className="col-span-1 md:col-span-2">
                                                                        <FormLabel>Notes</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                                                    Medical Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...medicalInfoForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={medicalInfoForm.control}
                                                                name="allergies"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Allergies</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicalInfoForm.control}
                                                                name="medicalConditions"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Medical Conditions</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={medicalInfoForm.control}
                                                                name="medicalNotes"
                                                                render={({ field }) => (
                                                                    <FormItem className="col-span-1 md:col-span-2">
                                                                        <FormLabel>Medical Notes</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="preferences" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <Languages className="h-5 w-5 mr-2 text-primary" />
                                                    Language & Communication
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...preferencesForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={preferencesForm.control}
                                                                name="language"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Preferred Language</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select language" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="en">English</SelectItem>
                                                                                    <SelectItem value="es">Spanish</SelectItem>
                                                                                    <SelectItem value="fr">French</SelectItem>
                                                                                    <SelectItem value="de">German</SelectItem>
                                                                                    <SelectItem value="zh">Chinese</SelectItem>
                                                                                    <SelectItem value="ar">Arabic</SelectItem>
                                                                                    <SelectItem value="hi">Hindi</SelectItem>
                                                                                    <SelectItem value="other">Other</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={preferencesForm.control}
                                                                name="secondaryLanguage"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Secondary Language</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={preferencesForm.control}
                                                                name="timezone"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Timezone</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select timezone" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                                                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                                                                    <SelectItem value="CST">Central Time (CST)</SelectItem>
                                                                                    <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                                                                                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                                                                                    <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={preferencesForm.control}
                                                                name="notificationPreferences"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Notification Preferences</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select notification preference" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="email">Email</SelectItem>
                                                                                    <SelectItem value="sms">SMS</SelectItem>
                                                                                    <SelectItem value="both">Both Email and SMS</SelectItem>
                                                                                    <SelectItem value="none">None</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="risk" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                                                    Risk Assessments
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...riskAssessmentForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="category"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Category</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select category" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="general">General</SelectItem>
                                                                                    <SelectItem value="physical">Physical</SelectItem>
                                                                                    <SelectItem value="environmental">Environmental</SelectItem>
                                                                                    <SelectItem value="medical">Medical</SelectItem>
                                                                                    <SelectItem value="behavioral">Behavioral</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="description"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Description</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="affectedParties"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Affected Parties</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="managementPlan"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Management Plan</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="likelihood"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Likelihood (1-5)</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select likelihood" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="1">1 - Very Unlikely</SelectItem>
                                                                                    <SelectItem value="2">2 - Unlikely</SelectItem>
                                                                                    <SelectItem value="3">3 - Possible</SelectItem>
                                                                                    <SelectItem value="4">4 - Likely</SelectItem>
                                                                                    <SelectItem value="5">5 - Very Likely</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={riskAssessmentForm.control}
                                                                name="severity"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Severity (1-5)</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select severity" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="1">1 - Minimal</SelectItem>
                                                                                    <SelectItem value="2">2 - Minor</SelectItem>
                                                                                    <SelectItem value="3">3 - Moderate</SelectItem>
                                                                                    <SelectItem value="4">4 - Major</SelectItem>
                                                                                    <SelectItem value="5">5 - Severe</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="documents" className="mt-4 space-y-6">
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg flex items-center">
                                                    <FileText className="h-5 w-5 mr-2 text-primary" />
                                                    Documents
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Form {...documentForm}>
                                                    <form className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={documentForm.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Document Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={documentForm.control}
                                                                name="type"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Document Type</FormLabel>
                                                                        <FormControl>
                                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                                <SelectTrigger>
                                                                                    <SelectValue placeholder="Select document type" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="identification">Identification</SelectItem>
                                                                                    <SelectItem value="medical">Medical Record</SelectItem>
                                                                                    <SelectItem value="consent">Consent Form</SelectItem>
                                                                                    <SelectItem value="assessment">Assessment</SelectItem>
                                                                                    <SelectItem value="care_plan">Care Plan</SelectItem>
                                                                                    <SelectItem value="other">Other</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={documentForm.control}
                                                                name="uploadDate"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Upload Date</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={documentForm.control}
                                                                name="file"
                                                                render={({ field }: { field: any }) => (
                                                                    <FormItem>
                                                                        <FormLabel>File</FormLabel>
                                                                        <FormControl>
                                                                            <Input id="file" type="file" className="cursor-pointer" />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </CardHeader>
                            <CardFooter className="flex justify-between border-t pt-6">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSaving || !hasUnsavedChanges}>
                                    {isSaving ? (
                                        <>
                                            <LoadingSpinner />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {user.firstName} {user.lastName}'s account and
                            remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 focus:ring-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

