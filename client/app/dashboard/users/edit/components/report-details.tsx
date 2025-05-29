"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Clipboard,
    Activity,
    AlertTriangle,
    Edit,
    Printer,
    Download,
    Flag,
    CheckCircle2,
} from "lucide-react"
import type { Report, ReportTask, BodyMapObservation, Alert } from "@/types/prismaTypes"
import { updateReportStatus } from "@/state/slices/reportSlice"
import type { AppDispatch, RootState } from "@/state/redux"

interface ReportDetailsProps {
    report: Report
    onBack: () => void
}

export const ReportDetails = ({ report, onBack }: ReportDetailsProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { isLoading, error } = useSelector((state: RootState) => state.report)
    const [activeTab, setActiveTab] = useState("summary")


    const handleStatusChange = (newStatus: string) => {
        dispatch(updateReportStatus({ id: report.id, status: newStatus }))
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DRAFT":
                return <Badge variant="outline">Draft</Badge>
            case "COMPLETED":
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Completed
                    </Badge>
                )
            case "EDITED":
                return (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Edited
                    </Badge>
                )
            case "FLAGGED":
                return (
                    <Badge variant="default" className="bg-red-100 text-red-800">
                        Flagged
                    </Badge>
                )
            case "REVIEWED":
                return (
                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                        Reviewed
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    const formatDuration = (start: Date, end: Date | null) => {
        if (!end) return "In progress"

        const durationMs = end.getTime() - start.getTime()
        const hours = Math.floor(durationMs / (1000 * 60 * 60))
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

        return `${hours}h ${minutes}m`
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-muted-foreground">Loading report details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error Loading Report</h2>
                    <p className="text-muted-foreground mb-4">There was a problem loading the report details.</p>
                    <Button onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Reports
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                </Button>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    {report.status !== "FLAGGED" ? (
                        <Button variant="destructive" size="sm" onClick={() => handleStatusChange("FLAGGED")}>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag Report
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange("COMPLETED")}>
                            Clear Flag
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl">{report.title || "Untitled Report"}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(report.checkInTime).toLocaleDateString()}
                                <span className="mx-2">•</span>
                                {getStatusBadge(report.status)}
                            </CardDescription>
                        </div>

                        {report.status === "DRAFT" && (
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Report
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Client</p>
                            <p className="font-medium flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {report.client?.fullName || "Unknown Client"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Caregiver</p>
                            <p className="font-medium flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {report.caregiver?.fullName || "Unknown Caregiver"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <p className="font-medium flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                {formatDuration(
                                    new Date(report.checkInTime),
                                    report.checkOutTime ? new Date(report.checkOutTime) : null,
                                )}
                            </p>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-6">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                            <TabsTrigger value="medications">Medications</TabsTrigger>
                            <TabsTrigger value="observations">Observations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Condition</h3>
                                <p>{report.condition}</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-medium mb-2">Summary</h3>
                                <p>{report.summary}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Check-in Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-start">
                                            <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">Time</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(report.checkInTime).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>

                                        {report.checkInLocation && (
                                            <div className="flex items-start">
                                                <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Location</p>
                                                    <p className="text-sm text-muted-foreground">{report.checkInLocation}</p>
                                                </div>
                                            </div>
                                        )}

                                        {report.checkInDistance !== null && (
                                            <div className="flex items-start">
                                                <Activity className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Distance</p>
                                                    <p className="text-sm text-muted-foreground">{report.checkInDistance} km</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {report.checkOutTime && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Check-out Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Time</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(report.checkOutTime).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {report.checkOutLocation && (
                                                <div className="flex items-start">
                                                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Location</p>
                                                        <p className="text-sm text-muted-foreground">{report.checkOutLocation}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {report.checkOutDistance !== null && (
                                                <div className="flex items-start">
                                                    <Activity className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Distance</p>
                                                        <p className="text-sm text-muted-foreground">{report.checkOutDistance} km</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {report.hasSignature && report.signatureImageUrl && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Signature</h3>
                                        <div className="border rounded-md p-4 w-64">
                                            <img
                                                src={report.signatureImageUrl || "/placeholder.svg"}
                                                alt="Signature"
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {report.lastEditedAt && (
                                <>
                                    <Separator />
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                                        <div className="flex items-start">
                                            <Edit className="h-5 w-5 mr-2 text-amber-600" />
                                            <div>
                                                <p className="font-medium text-amber-800">This report has been edited</p>
                                                <p className="text-sm text-amber-700">
                                                    Last edited on {new Date(report.lastEditedAt).toLocaleString()} by{" "}
                                                    {report.lastEditedBy || "Unknown"}
                                                </p>
                                                {report.lastEditReason && (
                                                    <p className="text-sm text-amber-700 mt-1">Reason: {report.lastEditReason}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {report.alerts && report.alerts.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Alerts</h3>
                                        <div className="space-y-2">
                                            {report.alerts.map((alert: Alert) => (
                                                <div key={alert.id} className="bg-red-50 border border-red-200 rounded-md p-4">
                                                    <div className="flex items-start">
                                                        <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                                                        <div>
                                                            <p className="font-medium text-red-800">{alert.type}</p>
                                                            <p className="text-sm text-red-700">{alert.message}</p>
                                                            <div className="flex items-center mt-1">
                                                                <Badge variant="outline" className="text-xs bg-red-100 border-red-200 text-red-800">
                                                                    {alert.severity}
                                                                </Badge>
                                                                <span className="text-xs text-red-600 ml-2">
                                                                    {new Date(alert.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="tasks" className="space-y-4">
                            {report.tasksCompleted && report.tasksCompleted.length > 0 ? (
                                <div className="space-y-4">
                                    {report.tasksCompleted.map((task: ReportTask) => (
                                        <div key={task.id} className="flex items-start border-b pb-4">
                                            <div
                                                className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${task.completed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                                                    }`}
                                            >
                                                {task.completed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{task.taskName}</p>
                                                {task.notes && <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>}
                                                {task.completedAt && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Completed at {new Date(task.completedAt).toLocaleTimeString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Clipboard className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No tasks recorded</h3>
                                    <p className="text-sm text-muted-foreground mt-1">No tasks were recorded for this visit</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="medications" className="space-y-4">
                            {report.medicationAdministrations && report.medicationAdministrations.length > 0 ? (
                                <div className="space-y-4">
                                    {report.medicationAdministrations.map((med: any) => (
                                        <div key={med.id} className="flex items-start border-b pb-4">
                                            <div
                                                className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${med.doseTaken ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {med.doseTaken ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{med.medicationRecord?.medication?.name || "Unknown Medication"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {med.doseType} dose - {med.doseTaken ? "Taken" : "Not taken"}
                                                </p>
                                                {med.notes && <p className="text-sm text-muted-foreground mt-1">{med.notes}</p>}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Administered at {new Date(med.administeredAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No medications administered</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        No medications were administered during this visit
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="observations" className="space-y-4">
                            {report.bodyMapObservations && report.bodyMapObservations.length > 0 ? (
                                <div className="space-y-4">
                                    {report.bodyMapObservations.map((observation: BodyMapObservation) => (
                                        <div key={observation.id} className="border rounded-md p-4">
                                            <h4 className="font-medium">{observation.bodyPart}</h4>
                                            <p className="text-sm mt-1">Condition: {observation.condition}</p>
                                            {observation.notes && <p className="text-sm text-muted-foreground mt-2">{observation.notes}</p>}
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Recorded on {new Date(observation.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No observations recorded</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        No body map observations were recorded for this visit
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Reports
                    </Button>

                    {report.status === "DRAFT" && (
                        <Button>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Report
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
