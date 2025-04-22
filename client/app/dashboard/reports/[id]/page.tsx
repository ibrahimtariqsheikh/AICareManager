"use client"

import { useParams } from "next/navigation"
import { useGetReportByIdQuery } from "@/state/api"
import { format, formatDistance } from "date-fns"
import { AlertCircle, ArrowLeft, FileText, Home, MapPin, Plus, User, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const ReportPage = () => {
    const { id } = useParams()
    const { data: report, isLoading, error } = useGetReportByIdQuery(id as string)

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
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error Loading Report</h2>
                    <p className="text-muted-foreground mb-4">There was a problem loading the report details.</p>
                    <Button asChild>
                        <Link href="/reports">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
                    <p className="text-muted-foreground mb-4">The requested report could not be found.</p>
                    <Button asChild>
                        <Link href="/reports">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Reports
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Format dates for display
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "Not set"
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date
            return format(dateObj, "EEEE, d MMMM yyyy")
        } catch (e) {
            return "Invalid date"
        }
    }

    const formatTime = (date: string | Date | undefined) => {
        if (!date) return "Not set"
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date
            return format(dateObj, "HH:mm")
        } catch (e) {
            return "Invalid time"
        }
    }

    // Calculate duration between check-in and check-out
    const calculateDuration = () => {
        try {
            const checkIn = new Date(report.checkInTime || "")
            const checkOut = new Date(report.checkOutTime || "")
            return formatDistance(checkOut, checkIn, { addSuffix: false })
        } catch (e) {
            return "Unknown duration"
        }
    }

    const clientName = `${report.client?.fullName || ""}`.trim() || "Unknown Client"
    const caregiverName =
        `${report.caregiver?.fullName || ""}`.trim() || "Unknown Caregiver"

    return (
        <div className="container mx-auto py-6 ">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{clientName}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Visit Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Client:</p>
                                    <p className="font-medium">{clientName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Care worker:</p>
                                    <p className="font-medium">{caregiverName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check in date:</p>
                                    <p>{formatDate(report.checkInTime)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check in time:</p>
                                    <div className="flex items-center">
                                        <p>{formatTime(report.checkInTime)}</p>
                                        {report.checkInDistance && (
                                            <Badge variant="outline" className="ml-2">
                                                {report.checkInDistance}km from client&apos;s home
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check out date:</p>
                                    <p>{formatDate(report.checkOutTime)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check out time:</p>
                                    <div className="flex items-center">
                                        <p>{formatTime(report.checkOutTime)}</p>
                                        {report.checkOutDistance && (
                                            <Badge variant="outline" className="ml-2">
                                                {report.checkOutDistance}km from client&apos;s home
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Duration:</p>
                                    <p>{calculateDuration()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Client condition:</p>
                                    <p>{report.condition || "Not captured"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status:</p>
                                <Badge variant={report.status === "COMPLETED" ? "secondary" : "default"}>{report.status}</Badge>
                            </div>

                            {report.summary && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Summary:</p>
                                    <p className="text-sm">{report.summary}</p>
                                </div>
                            )}

                            {report.hasSignature ? (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Client signature:</p>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Signed
                                    </Badge>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Client signature:</p>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        Not signed
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Check-in and check-out locations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check-in location:</p>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <p>{report.checkInLocation || "Location not recorded"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Check-out location:</p>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <p>{report.checkOutLocation || "Location not recorded"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <div className="text-center p-6">
                                    <Home className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">Map view not available</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {report.lastEditedAt && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle>Edit History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Last edited by: {report.lastEditedBy || "Unknown"}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(report.lastEditedAt).toLocaleString()}</p>
                                        </div>
                                        <Badge variant="outline">{report.lastEditReason || "No reason provided"}</Badge>
                                    </div>
                                </div>
                                {report.editHistory && report.editHistory.length > 0 ? (
                                    <div className="mt-4 space-y-2">
                                        {report.editHistory.map((edit, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">Edited by: {edit.editedBy || "Unknown"}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(edit.editedAt).toLocaleString()}</p>
                                                </div>
                                                <Badge variant="outline">{edit.reason || "No reason provided"}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Tasks</CardTitle>
                                <Badge variant="outline">{report.tasksCompleted?.length || 0} Tasks</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {report.tasksCompleted && report.tasksCompleted.length > 0 ? (
                                <div className="space-y-3">
                                    {report.tasksCompleted.map((task, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Wrench className="h-4 w-4 text-muted-foreground" />
                                            <span>{task.taskName}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No tasks completed</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Alerts</CardTitle>
                                <Badge variant="outline">{report.alerts?.length || 0} Alerts</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {report.alerts && report.alerts.length > 0 ? (
                                <div className="space-y-3">
                                    {report.alerts.map((alert, index) => (
                                        <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-md">
                                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-red-700">{alert.type}</p>
                                                <p className="text-sm text-red-600">{alert.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No alerts raised</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Body Map Observations</CardTitle>
                                <Badge variant="outline">{report.bodyMapObservations?.length || 0} Observations</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {report.bodyMapObservations && report.bodyMapObservations.length > 0 ? (
                                <div className="space-y-3">
                                    {report.bodyMapObservations.map((observation, index) => (
                                        <div key={index} className="p-3 border rounded-md">
                                            <p className="font-medium">{observation.bodyPart}</p>
                                            <p className="text-sm text-muted-foreground">{observation.condition}</p>
                                            {observation.notes && <p className="text-sm mt-1">{observation.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No body map observations</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Agency Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">No notes added</p>
                                <Button variant="ghost" size="sm">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ReportPage
