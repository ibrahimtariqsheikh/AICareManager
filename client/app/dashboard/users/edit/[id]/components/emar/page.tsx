"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Pill, FileText, Printer, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MedicationDialog } from "./medication-dialog"
import { AdministrationDialog } from "./administration-dialog"
import { MedicationCard } from "./medication-card"
import { MedicationTable } from "./medication-table"
import { MedicationCalendar } from "./medication-calendar"
import { PatientHeader } from "./patient-header"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setMedicationDialogOpen, setCurrentView, setSelectedMedication } from "@/state/slices/medicationSlice"
import type { User as UserType } from "@/types/prismaTypes"

interface EMARPageProps {
    user: UserType
}

export default function EMARPage({ user }: EMARPageProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState<"scheduled" | "prn">("scheduled")
    const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)
    const [isAdministrationDialogOpen, setIsAdministrationDialogOpen] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState<any>(null)
    const dispatch = useAppDispatch()
    const medications = useAppSelector(state => state.medication.medications)

    const handlePreviousMonth = () => {
        setCurrentDate(prev => subMonths(prev, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(prev => addMonths(prev, 1))
    }

    const handleAddMedication = () => {
        setSelectedMedication(null)
        setIsMedicationDialogOpen(true)
    }

    const handleEditMedication = (medication: any) => {
        setSelectedMedication(medication)
        setIsMedicationDialogOpen(true)
    }

    const handleAdministerMedication = (medication: any) => {
        setSelectedMedication(medication)
        setIsAdministrationDialogOpen(true)
    }

    const handleMedicationDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedMedication(null)
        }
        setIsMedicationDialogOpen(open)
    }

    const handleAdministrationDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedMedication(null)
        }
        setIsAdministrationDialogOpen(open)
    }

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
                                                    <span className="text-sm">{user.dateOfBirth || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Gender</span>
                                                    <span className="text-sm">{user.gender || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Room</span>
                                                    <span className="text-sm">{user.room || "Not assigned"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-2">Medical Information</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Primary Diagnosis</span>
                                                    <span className="text-sm">{user.medicalInfo?.primaryDiagnosis || "Not specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Allergies</span>
                                                    <span className="text-sm">{user.medicalInfo?.allergies || "None reported"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Blood Type</span>
                                                    <span className="text-sm">{user.medicalInfo?.bloodType || "Not specified"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="medication">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Medications</h2>
                                    <Button onClick={handleAddMedication} className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" /> Add Medication
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {medications.map(med => (
                                        <MedicationCard
                                            key={med.id}
                                            medication={med}
                                            onEdit={() => handleEditMedication(med)}
                                            onAdminister={() => handleAdministerMedication(med)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="medpass">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Medication Pass</h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="scheduled"
                                                checked={currentView === "scheduled"}
                                                onCheckedChange={(checked) => {
                                                    const newView = checked ? "scheduled" : "prn" as const;
                                                    setCurrentView(newView);
                                                    dispatch({ type: 'medication/setCurrentView', payload: newView });
                                                }}
                                            />
                                            <Label htmlFor="scheduled">Scheduled</Label>
                                        </div>
                                        <Button>
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print
                                        </Button>
                                    </div>
                                </div>
                                <MedicationTable />
                            </div>
                        </TabsContent>

                        <TabsContent value="medlog">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Medication Log</h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Search medications..." className="pl-8" />
                                        </div>
                                        <Button>
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print
                                        </Button>
                                    </div>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Medication Calendar</CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <span className="font-medium">
                                                    {format(currentDate, "MMMM yyyy")}
                                                </span>
                                                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <MedicationCalendar currentDate={currentDate} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <MedicationDialog
                    open={isMedicationDialogOpen}
                    onOpenChange={handleMedicationDialogClose}
                    medication={selectedMedication}
                />
                <AdministrationDialog
                    open={isAdministrationDialogOpen}
                    onOpenChange={handleAdministrationDialogClose}
                    medication={selectedMedication}
                />
            </main>
        </div>
    )
} 