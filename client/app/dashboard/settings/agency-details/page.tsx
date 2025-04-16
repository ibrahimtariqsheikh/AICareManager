"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast, Toaster } from "sonner"
import { Building2, MapPin, FileText, Info, Palette, Trash2 } from "lucide-react"
import { DocumentUpload } from "@/app/dashboard/settings/agency-details/components/document-upload"
import { DocumentList } from "@/app/dashboard/settings/agency-details/components/document-list"
import { useAppSelector } from "@/hooks/useAppSelector"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateAgencyMutation, useDeleteAgencyMutation } from "@/state/api"
import { useAppDispatch } from "@/state/redux"
import { setAgency } from "@/state/slices/agencySlice"

const CURRENCIES = [
    { code: "USD", name: "US Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "GBP", name: "British Pound" },
    { code: "EUR", name: "Euro" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "INR", name: "Indian Rupee" },
] as const;

const TIME_ZONES = [
    { value: "UTC", label: "Coordinated Universal Time (UTC)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" },
] as const;

const formSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    extension: z.number().optional(),
    mobileNumber: z.number().optional(),
    landlineNumber: z.number().nullable(),
    website: z.string().url("Invalid website URL").optional(),
    logo: z.string().url("Invalid logo URL").nullable(),
    primaryColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code")
        .nullable(),
    secondaryColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code")
        .nullable(),
    isActive: z.boolean(),
    isSuspended: z.boolean(),
    hasScheduleV2: z.boolean(),
    hasEMAR: z.boolean(),
    hasFinance: z.boolean(),
    isWeek1And2ScheduleEnabled: z.boolean(),
    hasPoliciesAndProcedures: z.boolean(),
    isTestAccount: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    licenseNumber: z.string().nullable(),
    timeZone: z.string(),
    currency: z.string(),
    maxUsers: z.number().nullable(),
    maxClients: z.number().nullable(),
    maxCareWorkers: z.number().nullable(),
})



export default function AgencyPage() {
    const agencyRedux = useAppSelector((state) => state.agency.agency)
    const dispatch = useAppDispatch()
    const [updateAgency, { isLoading: isUpdating }] = useUpdateAgencyMutation()
    const [deleteAgency, { isLoading: isDeleting }] = useDeleteAgencyMutation()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [formInitialized, setFormInitialized] = useState(false)

    // Initialize form with empty values
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            email: undefined,
            description: undefined,
            address: undefined,
            extension: undefined,
            mobileNumber: undefined,
            landlineNumber: null,
            website: undefined,
            logo: null,
            primaryColor: null,
            secondaryColor: null,
            isActive: true,
            isSuspended: false,
            hasScheduleV2: false,
            hasEMAR: false,
            hasFinance: false,
            isWeek1And2ScheduleEnabled: false,
            hasPoliciesAndProcedures: false,
            isTestAccount: false,
            createdAt: "",
            updatedAt: "",
            licenseNumber: null,
            timeZone: "Europe/London",
            currency: "GBP",
            maxUsers: null,
            maxClients: null,
            maxCareWorkers: null
        }
    })


    useEffect(() => {
        if (agencyRedux && !formInitialized) {
            console.log("Setting form values from Redux data:", agencyRedux);
            form.reset({
                id: agencyRedux.id || "",
                name: agencyRedux.name || "",
                email: agencyRedux.email || undefined,
                description: agencyRedux.description || undefined,
                address: agencyRedux.address || undefined,
                extension: agencyRedux.extension || undefined,
                mobileNumber: agencyRedux.mobileNumber || undefined,
                landlineNumber: agencyRedux.landlineNumber || null,
                website: agencyRedux.website || undefined,
                logo: agencyRedux.logo || null,
                primaryColor: agencyRedux.primaryColor || null,
                secondaryColor: agencyRedux.secondaryColor || null,
                isActive: agencyRedux.isActive || true,
                isSuspended: agencyRedux.isSuspended || false,
                hasScheduleV2: agencyRedux.hasScheduleV2 || false,
                hasEMAR: agencyRedux.hasEMAR || false,
                hasFinance: agencyRedux.hasFinance || false,
                isWeek1And2ScheduleEnabled: agencyRedux.isWeek1And2ScheduleEnabled || false,
                hasPoliciesAndProcedures: agencyRedux.hasPoliciesAndProcedures || false,
                isTestAccount: agencyRedux.isTestAccount || false,
                createdAt: agencyRedux.createdAt || "",
                updatedAt: agencyRedux.updatedAt || "",
                licenseNumber: agencyRedux.licenseNumber || null,
                timeZone: agencyRedux.timeZone || "Europe/London",
                currency: agencyRedux.currency || "GBP",
                maxUsers: agencyRedux.maxUsers || null,
                maxClients: agencyRedux.maxClients || null,
                maxCareWorkers: agencyRedux.maxCareWorkers || null
            });
            setFormInitialized(true);
        }
    }, [agencyRedux, form, formInitialized]);

    // State for dialogs
    const [, setIsDocumentInfoOpen] = useState(false)

    // Documents state - in a real app, this would come from an API
    const [documents, setDocuments] = useState([
        { id: "1", name: "operational_documents.pdf", type: "operational_documents", uploadedAt: new Date().toISOString() },
    ])

    const handleDocumentUpload = (file: File) => {
        // In a real app, you would upload the file to your server
        const newDocument = {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: "operational_documents",
            uploadedAt: new Date().toISOString(),
        }

        setDocuments((prev) => [...prev, newDocument])
        toast.success(`Document ${file.name} uploaded successfully`)
    }

    const handleDocumentDelete = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        toast.success("Document deleted successfully")
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form submission started");
        try {
            console.log("Form submitted with data:", data);
            console.log("Current form state:", form.getValues());
            console.log("Form errors:", form.formState.errors);

            const result = await updateAgency({
                agencyId: data.id,
                agency: {
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            }).unwrap()

            if (result) {
                console.log("Backend Response:", result)
                // Update Redux store with the new agency data
                dispatch(setAgency(result))
                toast.success("Agency updated successfully!", {
                    duration: 4000,
                    position: "top-right"
                });
            }
        } catch (error: any) {
            console.error("Error updating agency:", error)
            const errorMessage = error?.data?.message || "Failed to update agency information"
            toast.error(errorMessage, {
                duration: 4000,
                position: "top-right"
            });
        }
    }

    const handleDeleteAgency = async () => {
        try {
            await deleteAgency({
                agencyId: agencyRedux?.id || ""
            }).unwrap()
            toast.success("Agency deleted successfully")
            // You might want to redirect to a different page after deletion
        } catch (error) {
            console.error("Error deleting agency:", error)
            toast.error("Failed to delete agency")
        } finally {
            setIsDeleteDialogOpen(false)
        }
    }

    // Debug current form values
    const currentValues = form.watch();
    console.log("Current form values:", currentValues);
    console.log("Form initialized:", formInitialized);
    console.log("Agency Redux data:", agencyRedux);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Toaster position="top-right" richColors closeButton />

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Agency Settings</h1>
                        <p className="text-muted-foreground">Manage your agency information, contact details, and documents</p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={true} // Disabled since there's only one agency
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Agency
                    </Button>
                </div>
            </div>

            {/* Show loading state while form is initializing */}
            {!formInitialized && agencyRedux ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2 text-sm text-muted-foreground">Loading agency information...</p>
                    </div>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={async (e) => {
                        console.log("Form submit event triggered");
                        e.preventDefault();
                        try {
                            const data = form.getValues();
                            console.log("Form data:", data);
                            await onSubmit(data);
                        } catch (error) {
                            console.error("Form submission error:", error);
                        }
                    }} className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid grid-cols-4 mb-8">
                                <TabsTrigger value="general" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>General</span>
                                </TabsTrigger>
                                <TabsTrigger value="contact" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Contact</span>
                                </TabsTrigger>
                                <TabsTrigger value="documents" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>Documents</span>
                                </TabsTrigger>
                                <TabsTrigger value="branding" className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    <span>Branding</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* General Information Tab */}
                            <TabsContent value="general">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="h-5 w-5 text-primary" />
                                            <CardTitle>General Information</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Agency Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
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
                                                control={form.control}
                                                name="licenseNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>License Number</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} placeholder="Enter license number" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="timeZone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Time Zone</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || "UTC"}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select time zone" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {TIME_ZONES.map((timeZone) => (
                                                                        <SelectItem key={timeZone.value} value={timeZone.value}>
                                                                            {timeZone.label}
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
                                                    name="currency"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Currency</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select currency" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {CURRENCIES.map((currency) => (
                                                                        <SelectItem key={currency.code} value={currency.code}>
                                                                            {currency.name} ({currency.code})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="maxUsers"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Users</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                                    placeholder="No limit"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="maxClients"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Clients</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                                    placeholder="No limit"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="maxCareWorkers"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Care Workers</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                                    placeholder="No limit"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium mb-3">Agency Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="hasScheduleV2"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Schedule V2</FormLabel>
                                                                <FormDescription>Enable advanced scheduling features</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Other feature toggles remain the same */}
                                                <FormField
                                                    control={form.control}
                                                    name="hasEMAR"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>EMAR</FormLabel>
                                                                <FormDescription>Electronic Medication Administration Record</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="hasFinance"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Finance</FormLabel>
                                                                <FormDescription>Enable financial management features</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="isWeek1And2ScheduleEnabled"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Week 1 & 2 Schedule</FormLabel>
                                                                <FormDescription>Enable bi-weekly scheduling</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="hasPoliciesAndProcedures"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Policies & Procedures</FormLabel>
                                                                <FormDescription>Enable policies and procedures module</FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* The other TabsContent sections remain the same */}
                            {/* Contact Details Tab */}
                            <TabsContent value="contact">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <CardTitle>Contact Details</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        {/* Form fields for contact details */}
                                        <div className="grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* Other contact fields */}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Documents Tab */}
                            <TabsContent value="documents">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <CardTitle>Documents</CardTitle>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => setIsDocumentInfoOpen(true)}>
                                                <Info className="h-4 w-4 mr-2" />
                                                How care workers see these
                                            </Button>
                                            <DocumentUpload onUpload={handleDocumentUpload} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <DocumentList documents={documents} onDelete={handleDocumentDelete} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Branding Tab - Add fields here if needed */}
                            <TabsContent value="branding">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            <Palette className="h-5 w-5 text-primary" />
                                            <CardTitle>Branding</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid gap-4">
                                            <FormField
                                                control={form.control}
                                                name="primaryColor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Primary Color</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} placeholder="#000000" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="secondaryColor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Secondary Color</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} placeholder="#FFFFFF" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isUpdating}
                                onClick={() => console.log("Save button clicked")}
                            >
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Agency</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this agency? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAgency} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
