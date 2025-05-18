"use client"

import { useAppSelector } from "@/hooks/useAppSelector"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { AlertCircle, CheckCircle, Clock, FileEdit, Flag, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CustomInput } from "@/components/ui/custom-input"

export default function ReportsPage() {
    const { agency } = useAppSelector((state: any) => state.agency)
    const reports = agency?.reports || []
    console.log("reports", reports)
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)

    // Dummy alerts data
    const dummyAlerts = [
        {
            id: 1,
            title: "Medication Reminder",
            type: "MEDICATION",
            status: "PENDING",
            client: { fullName: "John Smith" },
            caregiver: { fullName: "Sarah Johnson" },
            timestamp: new Date().toISOString(),
            description: "Client missed morning medication"
        },
        {
            id: 2,
            title: "Fall Risk Alert",
            type: "SAFETY",
            status: "URGENT",
            client: { fullName: "Mary Williams" },
            caregiver: { fullName: "Michael Brown" },
            timestamp: new Date().toISOString(),
            description: "Client attempted to walk without assistance"
        },
        {
            id: 3,
            title: "Appointment Reminder",
            type: "APPOINTMENT",
            status: "INFO",
            client: { fullName: "Robert Davis" },
            caregiver: { fullName: "Emily Wilson" },
            timestamp: new Date().toISOString(),
            description: "Doctor's appointment scheduled for tomorrow"
        },
        {
            id: 4,
            title: "Behavioral Alert",
            type: "BEHAVIOR",
            status: "WARNING",
            client: { fullName: "Patricia Miller" },
            caregiver: { fullName: "David Taylor" },
            timestamp: new Date().toISOString(),
            description: "Unusual behavior patterns observed"
        }
    ]

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-600/20 text-green-900 border border-green-400/20"
            case "DRAFT":
                return "bg-yellow-600/20 text-yellow-900 border border-yellow-400/20"
            case "EDITED":
                return "bg-blue-600/20 text-blue-900 border border-blue-400/20"
            case "FLAGGED":
                return "bg-red-600/20 text-red-900 border border-red-400/20"
            case "REVIEWED":
                return "bg-purple-600/20 text-purple-900 border border-purple-400/20"
            default:
                return "bg-gray-600/20 text-gray-900 border border-gray-400/20"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle className="h-3.5 w-3.5 mr-1" />
            case "DRAFT":
                return <Clock className="h-3.5 w-3.5 mr-1" />
            case "EDITED":
                return <FileEdit className="h-3.5 w-3.5 mr-1" />
            case "FLAGGED":
                return <Flag className="h-3.5 w-3.5 mr-1" />
            case "REVIEWED":
                return <AlertCircle className="h-3.5 w-3.5 mr-1" />
            default:
                return null
        }
    }

    const getAlertTypeColor = (type: string) => {
        switch (type) {
            case "MEDICATION":
                return "bg-blue-600/20 text-blue-900 border border-blue-400/20"
            case "SAFETY":
                return "bg-red-600/20 text-red-900 border border-red-400/20"
            case "APPOINTMENT":
                return "bg-purple-600/20 text-purple-900 border border-purple-400/20"
            case "BEHAVIOR":
                return "bg-yellow-600/20 text-yellow-900 border border-yellow-400/20"
            default:
                return "bg-gray-600/20 text-gray-900 border border-gray-400/20"
        }
    }

    const getAlertStatusColor = (status: string) => {
        switch (status) {
            case "URGENT":
                return "bg-red-600/20 text-red-900 border border-red-400/20"
            case "WARNING":
                return "bg-yellow-600/20 text-yellow-900 border border-yellow-400/20"
            case "INFO":
                return "bg-blue-600/20 text-blue-900 border border-blue-400/20"
            case "PENDING":
                return "bg-gray-600/20 text-gray-900 border border-gray-400/20"
            default:
                return "bg-gray-600/20 text-gray-900 border border-gray-400/20"
        }
    }

    const filteredReports = (status?: string) => {
        let filtered = reports

        if (status && status !== "all") {
            filtered = reports.filter((report: any) => report.status === status.toUpperCase())
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (report: any) =>
                    (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (report.client?.fullName && report.client.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (report.caregiver?.fullName && report.caregiver.fullName.toLowerCase().includes(searchTerm.toLowerCase())),
            )
        }

        return filtered
    }

    const renderReportItem = (report: any) => (
        <Link href={`/dashboard/reports/${report.id}`} key={report.id} className="block transition-all duration-200">
            <Card className="hover:bg-muted/50 transition-colors duration-200">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium truncate">{report.title || "Untitled Report"}</h3>
                                <div className={cn("flex items-center text-xs", getStatusColor(report.status), "rounded-md px-2 py-0.5 font-medium")}>
                                    {getStatusIcon(report.status)}
                                    {report.status}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Client:</span>
                                    {report.client?.fullName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Caregiver:</span>
                                    {report.caregiver?.fullName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Date:</span>
                                    {format(new Date(report.checkInTime), "MMM dd, HH:mm")}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )

    const renderAlertItem = (alert: any) => (
        <Card key={alert.id} className="hover:bg-muted/50 transition-colors duration-200">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{alert.title}</h3>
                            <div className={cn("flex items-center text-xs", getAlertTypeColor(alert.type), "rounded-md px-2 py-0.5 font-medium")}>
                                {alert.type}
                            </div>
                            <div className={cn("flex items-center text-xs", getAlertStatusColor(alert.status), "rounded-md px-2 py-0.5 font-medium")}>
                                {alert.status}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <span className="font-medium">Client:</span>
                                {alert.client?.fullName}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="font-medium">Caregiver:</span>
                                {alert.caregiver?.fullName}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="font-medium">Time:</span>
                                {format(new Date(alert.timestamp), "MMM dd, HH:mm")}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div
            className={`relative min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
            <div className="container mx-auto px-6 py-10">
                <div className="space-y-8">
                    <Tabs defaultValue="all" className="space-y-8">
                        <div className="flex items-center justify-between space-y-0">
                            <TabsList className="justify-start h-auto p-1 bg-muted/50 w-fit">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    Reports
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    Alerts
                                </TabsTrigger>
                            </TabsList>

                            <CustomInput
                                placeholder="Search"
                                value={searchTerm}
                                icon={<Search className="h-4 w-4" />}
                                onChange={(value: string) => setSearchTerm(value)}
                                className="w-[300px]"
                            />
                        </div>

                        <TabsContent value="all" className="space-y-4 mt-6">
                            {filteredReports().length > 0 ? (
                                <div className="grid gap-4">{filteredReports().map(renderReportItem)}</div>
                            ) : (
                                <Card className="text-center py-16 border-dashed">
                                    <CardContent className="pt-16">
                                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-full">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <CardTitle className="text-lg mb-1">
                                            {searchTerm ? "No reports match your search" : "No reports available"}
                                        </CardTitle>
                                        <CardDescription>
                                            {searchTerm
                                                ? "Try adjusting your search parameters"
                                                : "Reports will appear here once they are created"}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4 mt-6">
                            {dummyAlerts.length > 0 ? (
                                <div className="grid gap-4">{dummyAlerts.map(renderAlertItem)}</div>
                            ) : (
                                <Card className="text-center py-16">
                                    <CardContent className="pt-16">
                                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                                            <AlertCircle className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <CardTitle className="text-lg mb-1">
                                            {searchTerm ? "No alerts match your search" : "No alerts available"}
                                        </CardTitle>
                                        <CardDescription>
                                            {searchTerm ? "Try adjusting your search parameters" : "Alerts will appear here"}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div >
        </div >
    )
}
