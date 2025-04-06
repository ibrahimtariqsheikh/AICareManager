"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Pill, FileText, Printer, Search } from "lucide-react"
import type { UserAllDetailsResponse } from "@/state/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MedicationDialog } from "../components/emar/medication-dialog"
import { AdministrationDialog } from "../components/emar/administration-dialog"
import { MedicationCard } from "../components/emar/medication-card"
import { MedicationTable } from "../components/emar/medication-table"
import { MedicationCalendar } from "../components/emar/medication-calendar"
import { PatientHeader } from "../components/emar/patient-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { User as UserType } from "@/types/prismaTypes"
import type { Medication } from "@/state/slices/medicationSlice"
import { Skeleton } from "@/components/ui/skeleton"

function LoadingSkeleton() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-6 px-4 max-w-7xl">
                {/* Patient Header Skeleton */}
                <Card className="overflow-hidden mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Skeleton */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>

                    {/* Content Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function EMARPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [user, setUser] = useState<UserType | null>(null)
    const [currentView, setCurrentView] = useState<"scheduled" | "prn">("scheduled")
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)
    const [isAdministrationDialogOpen, setIsAdministrationDialogOpen] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)
    const params = useParams()
    const searchParams = useSearchParams()

    useEffect(() => {
        const userData = searchParams.get('user')
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData)
                // Ensure we have the profile data
                if (!parsedUser.profile) {
                    parsedUser.profile = {
                        firstName: parsedUser.firstName,
                        lastName: parsedUser.lastName,
                        email: parsedUser.email,
                        phoneNumber: parsedUser.phoneNumber,
                        room: parsedUser.room,
                        admissionDate: parsedUser.admissionDate,
                        medicalInfo: parsedUser.medicalInfo || {},
                        careLevel: parsedUser.careLevel || "Low",
                        age: parsedUser.age,
                        avatarUrl: parsedUser.avatarUrl
                    }
                }
                setUser(parsedUser)
            } catch (error) {
                console.error('Error parsing user data:', error)
            }
        }
    }, [searchParams])

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1))
    }

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1))
    }

    // Open medication dialog
    const openMedicationDialog = (medication: Medication | null = null) => {
        setSelectedMedication(medication)
        setIsMedicationDialogOpen(true)
    }

    // Open administration dialog
    const openAdministrationDialog = (medication: Medication) => {
        setSelectedMedication(medication)
        setIsAdministrationDialogOpen(true)
    }

    // Mock medications (we'll replace this with real data later)
    const mockMedications: Medication[] = [
        {
            id: "med1",
            name: "Lisinopril",
            dosage: "10mg",
            instructions: "Take with food in the morning",
            reason: "Hypertension",
            route: "Oral",
            frequency: "Once daily",
            times: ["08:00"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "8:00am"
        },
        {
            id: "med2",
            name: "Metformin",
            dosage: "500mg",
            instructions: "Take with meals",
            reason: "Type 2 Diabetes",
            route: "Oral",
            frequency: "Twice daily",
            times: ["08:00", "19:00"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "8:00am, 7:00pm"
        },
        {
            id: "med3",
            name: "Acetaminophen",
            dosage: "500mg",
            instructions: "Take for pain, not to exceed 4000mg in 24 hours",
            reason: "Pain relief",
            route: "Oral",
            frequency: "As needed",
            times: ["As needed"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "PRN"
        }
    ]

    if (!user) {
        return <LoadingSkeleton />
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-6 px-4 max-w-7xl">
                {/* Patient Information */}
                <PatientHeader user={user} />

                {/* Main Content */}
                <div className="mt-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="medication">Medication</TabsTrigger>
                            <TabsTrigger value="medpass">Med Pass</TabsTrigger>
                            <TabsTrigger value="medlog">Med Log</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Patient Overview</CardTitle>
                                    <CardDescription>View patient's general information and health summary</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-medium mb-2">Personal Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                                                    <span className="text-sm">{user.profile?.dateOfBirth || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Gender</span>
                                                    <span className="text-sm">{user.profile?.gender || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Room</span>
                                                    <span className="text-sm">{user.profile?.room || "Not assigned"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Admission Date</span>
                                                    <span className="text-sm">{user.profile?.admissionDate || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Medical Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Primary Diagnosis</span>
                                                    <span className="text-sm">{user.profile?.medicalInfo?.primaryDiagnosis || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Allergies</span>
                                                    <span className="text-sm">{user.profile?.medicalInfo?.allergies || "None reported"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Blood Type</span>
                                                    <span className="text-sm">{user.profile?.medicalInfo?.bloodType || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="medication">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Medication List</CardTitle>
                                        <CardDescription>View and manage patient's medications</CardDescription>
                                    </div>
                                    <Button onClick={() => openMedicationDialog()} className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" /> Add Medication
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {mockMedications.map(med => (
                                            <MedicationCard
                                                key={med.id}
                                                medication={med}
                                                onEdit={() => openMedicationDialog(med)}
                                                onAdminister={() => openAdministrationDialog(med)}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="medpass">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Medication Pass</CardTitle>
                                    <CardDescription>Scheduled medications for administration</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="scheduled"
                                                checked={currentView === "scheduled"}
                                                onCheckedChange={(checked) => setCurrentView(checked ? "scheduled" : "prn")}
                                            />
                                            <Label htmlFor="scheduled">Scheduled</Label>
                                        </div>
                                        <Button>
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print
                                        </Button>
                                    </div>
                                    <MedicationTable />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="medlog">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Medication Log</CardTitle>
                                        <CardDescription>Track medication administration history</CardDescription>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" onClick={goToPreviousMonth} size="icon">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-lg font-medium w-40 text-center">{format(currentDate, "MMMM yyyy")}</div>
                                        <Button variant="outline" onClick={goToNextMonth} size="icon">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <MedicationCalendar currentDate={currentDate} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Dialogs */}
                <MedicationDialog
                    open={isMedicationDialogOpen}
                    onOpenChange={setIsMedicationDialogOpen}
                    medication={selectedMedication}
                />
                <AdministrationDialog
                    open={isAdministrationDialogOpen}
                    onOpenChange={setIsAdministrationDialogOpen}
                    medication={selectedMedication}
                />
            </main>
        </div>
    )
} 