"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Pill, FileText, Printer, Search } from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MedicationDialog } from "../components/emar/medication-dialog"
import { AdministrationDialog } from "../components/emar/administration-dialog"
import { MedicationCard } from "../components/emar/medication-card"
import { MedicationTable } from "../components/emar/medication-table"
import { MedicationCalendar } from "../components/emar/medication-calendar"
import { PatientHeader } from "../components/emar/patient-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function EMARPage() {
    const params = useParams()
    const userId = params.id as string
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState<"scheduled" | "prn">("scheduled")
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)
    const [isAdministrationDialogOpen, setIsAdministrationDialogOpen] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState<any>(null)

    // Mock user data
    const mockUser = {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        profile: {
            avatarUrl: "/placeholder.svg?height=80&width=80",
            careLevel: "Medium",
            age: "72",
            room: "203B",
            admissionDate: "Jan 15, 2023",
            phone: "(555) 123-4567",
            dateOfBirth: "May 10, 1951",
            gender: "Male",
            medicalInfo: {
                primaryDiagnosis: "Hypertension, Type 2 Diabetes",
                allergies: "Penicillin, Shellfish",
                primaryPhysician: "Dr. Sarah Johnson",
                bloodType: "O+"
            }
        }
    }

    const user = mockUser
    const isLoading = false

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1))
    }

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1))
    }

    // Open medication dialog
    const openMedicationDialog = (medication: any = null) => {
        setSelectedMedication(medication)
        setIsMedicationDialogOpen(true)
    }

    // Open administration dialog
    const openAdministrationDialog = (medication: any) => {
        setSelectedMedication(medication)
        setIsAdministrationDialogOpen(true)
    }

    // Mock medications
    const mockMedications = [
        {
            id: "med1",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            route: "Oral",
            startDate: "2023-01-20",
            endDate: "2023-12-31",
            instructions: "Take with food in the morning",
            isPRN: false,
            reason: "Hypertension",
            times: ["08:00"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "8:00am"
        },
        {
            id: "med2",
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            route: "Oral",
            startDate: "2023-01-15",
            endDate: null,
            instructions: "Take with meals",
            isPRN: false,
            reason: "Type 2 Diabetes",
            times: ["08:00", "19:00"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "8:00am, 7:00pm"
        },
        {
            id: "med3",
            name: "Acetaminophen",
            dosage: "500mg",
            frequency: "As needed",
            route: "Oral",
            startDate: "2023-01-10",
            endDate: null,
            instructions: "Take for pain, not to exceed 4000mg in 24 hours",
            isPRN: true,
            reason: "Pain relief",
            times: ["As needed"],
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            schedule: "PRN"
        }
    ]

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-6 px-4 max-w-7xl">
                {/* Patient Information */}
                <PatientHeader user={user} />

                {/* Main Content */}
                <div className="mt-6">
                    <Tabs defaultValue="medlog" className="w-full">
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
                                                    <span className="text-sm text-muted-foreground">Primary Physician</span>
                                                    <span className="text-sm">{user.profile?.medicalInfo?.primaryPhysician || "Not specified"}</span>
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
                                    <div className="flex space-x-2 mb-4">
                                        <Button
                                            variant={currentView === "scheduled" ? "default" : "outline"}
                                            onClick={() => setCurrentView("scheduled")}
                                            className={currentView === "scheduled" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                        >
                                            Scheduled
                                        </Button>
                                        <Button
                                            variant={currentView === "prn" ? "default" : "outline"}
                                            onClick={() => setCurrentView("prn")}
                                            className={currentView === "prn" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                        >
                                            PRN
                                        </Button>
                                        <div className="ml-auto flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                                <span className="text-sm">Taken</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="text-sm">Not taken</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                                <span className="text-sm">Not reported</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                                                <span className="text-sm">Not scheduled</span>
                                            </div>
                                        </div>
                                    </div>

                                    <MedicationCalendar currentDate={currentDate} />
                                </CardContent>

                                <CardFooter className="flex justify-between border-t pt-6">
                                    <Button variant="outline">
                                        <Printer className="mr-2 h-4 w-4" /> Print Report
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <FileText className="mr-2 h-4 w-4" /> Export Data
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Medication Dialog */}
            <MedicationDialog
                open={isMedicationDialogOpen}
                onOpenChange={setIsMedicationDialogOpen}
                medication={selectedMedication}
            />

            {/* Administration Dialog */}
            <AdministrationDialog
                open={isAdministrationDialogOpen}
                onOpenChange={setIsAdministrationDialogOpen}
                medication={selectedMedication}
            />
        </div>
    )
} 