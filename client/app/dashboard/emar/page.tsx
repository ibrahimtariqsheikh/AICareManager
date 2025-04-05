"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Pill, FileText, Printer, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MedicationDialog } from "./components/medication-dialog"
import { AdministrationDialog } from "./components/administration-dialog"
import { MedicationCard } from "./components/medication-card"
import { MedicationTable } from "./components/medication-table"
import { MedicationCalendar } from "./components/medication-calendar"
import { PatientHeader } from "./components/patient-header"

interface Medication {
    name: string;
    dosage: string;
    instructions: string;
    reason: string;
    schedule: string;
}

export default function EMARPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState<"scheduled" | "prn">("scheduled")
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)
    const [isAdministrationDialogOpen, setIsAdministrationDialogOpen] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState<any>(null)
    const [isDarkMode, setIsDarkMode] = useState(false)

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
    const openAdministrationDialog = (medication: any) => {
        setSelectedMedication(medication)
        setIsAdministrationDialogOpen(true)
    }

    return (
        <div className={`min-h-screen`}>


            <main className="container mx-auto py-6 px-4 max-w-7xl">
                {/* Patient Information */}
                <PatientHeader />

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
                                                    <span className="text-sm">March 1, 2001</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Gender</span>
                                                    <span className="text-sm">Male</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Room</span>
                                                    <span className="text-sm">A1</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Admission Date</span>
                                                    <span className="text-sm">Jan 1, 2022</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Medical Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Primary Diagnosis</span>
                                                    <span className="text-sm">Hypertension, Diabetes Type 2</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Allergies</span>
                                                    <span className="text-sm">Penicillin, Shellfish</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Primary Physician</span>
                                                    <span className="text-sm">Dr. Sarah Johnson</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Blood Type</span>
                                                    <span className="text-sm">O+</span>
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
                                    <Button onClick={() => openMedicationDialog()} className="bg-emerald-600 hover:bg-emerald-700">
                                        <Plus className="mr-2 h-4 w-4" /> Add Medication
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <MedicationCard
                                            name="Hydrocortisone"
                                            dosage="5mg"
                                            instructions="Take 1 Tab by Mouth Twice Daily"
                                            reason="A chemical found in tobacco for..."
                                            schedule="8:00am, 1:00pm"
                                            onEdit={() =>
                                                openMedicationDialog({
                                                    name: "Hydrocortisone",
                                                    dosage: "5mg",
                                                    instructions: "Take 1 Tab by Mouth Twice Daily",
                                                    reason: "A chemical found in tobacco for...",
                                                    schedule: "8:00am, 1:00pm",
                                                })
                                            }
                                            onAdminister={() =>
                                                openAdministrationDialog({
                                                    name: "Hydrocortisone",
                                                    dosage: "5mg",
                                                })
                                            }
                                        />

                                        <MedicationCard
                                            name="Lisinopril"
                                            dosage="10mg"
                                            instructions="Take 1 Tab by Mouth Once Daily"
                                            reason="Hypertension"
                                            schedule="8:00am"
                                            onEdit={() =>
                                                openMedicationDialog({
                                                    name: "Lisinopril",
                                                    dosage: "10mg",
                                                    instructions: "Take 1 Tab by Mouth Once Daily",
                                                    reason: "Hypertension",
                                                    schedule: "8:00am",
                                                })
                                            }
                                            onAdminister={() =>
                                                openAdministrationDialog({
                                                    name: "Lisinopril",
                                                    dosage: "10mg",
                                                })
                                            }
                                        />

                                        <MedicationCard
                                            name="Metformin"
                                            dosage="500mg"
                                            instructions="Take 1 Tab by Mouth Twice Daily"
                                            reason="Diabetes Type 2"
                                            schedule="8:00am, 7:00pm"
                                            onEdit={() =>
                                                openMedicationDialog({
                                                    name: "Metformin",
                                                    dosage: "500mg",
                                                    instructions: "Take 1 Tab by Mouth Twice Daily",
                                                    reason: "Diabetes Type 2",
                                                    schedule: "8:00am, 7:00pm",
                                                })
                                            }
                                            onAdminister={() =>
                                                openAdministrationDialog({
                                                    name: "Metformin",
                                                    dosage: "500mg",
                                                })
                                            }
                                        />

                                        <MedicationCard
                                            name="Aspirin"
                                            dosage="81mg"
                                            instructions="Take 1 Tab by Mouth Once Daily"
                                            reason="Blood Thinner"
                                            schedule="8:00am"
                                            onEdit={() =>
                                                openMedicationDialog({
                                                    name: "Aspirin",
                                                    dosage: "81mg",
                                                    instructions: "Take 1 Tab by Mouth Once Daily",
                                                    reason: "Blood Thinner",
                                                    schedule: "8:00am",
                                                })
                                            }
                                            onAdminister={() =>
                                                openAdministrationDialog({
                                                    name: "Aspirin",
                                                    dosage: "81mg",
                                                })
                                            }
                                        />
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
                                            className={currentView === "scheduled" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                        >
                                            Scheduled
                                        </Button>
                                        <Button
                                            variant={currentView === "prn" ? "default" : "outline"}
                                            onClick={() => setCurrentView("prn")}
                                            className={currentView === "prn" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                        >
                                            PRN
                                        </Button>
                                        <div className="ml-auto flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
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

                                    <MedicationCalendar
                                        currentDate={currentDate}
                                        currentView={currentView}
                                        onAdminister={openAdministrationDialog}
                                    />
                                </CardContent>

                                <CardFooter className="flex justify-between border-t pt-6">
                                    <Button variant="outline">
                                        <Printer className="mr-2 h-4 w-4" /> Print Report
                                    </Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700">
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

