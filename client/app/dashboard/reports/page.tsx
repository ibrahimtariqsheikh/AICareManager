"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertCircle,

    Calendar,

    Eye,
    FileText,
    Filter,
    Pill,
    Search,
    Sparkles,
    UserIcon,
    Users,
    Utensils,
    X,
} from "lucide-react"

import { format as formatDateFns } from "date-fns"
import { AIImproveDialog } from "./components/ai-improve-dialog"

import type { Report, ReportAlert, ReportTask } from "@/types/prismaTypes"


import type { RootState } from "@/state/redux"


export default function ReportsPage() {

    const { reports, isLoading, error } = useSelector((state: RootState) => state.report)

    const [searchQuery, setSearchQuery] = useState("")
    const [, setActiveTab] = useState("visits")
    const [selectedReport, setSelectedReportState] = useState<Report | null>(null)
    const [, setIsDetailViewOpen] = useState(false)
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
    const [filterOptions, setFilterOptions] = useState({
        dateFrom: "",
        dateTo: "",
        careWorker: "",
        client: "",
        taskType: "",
        alertType: "",
        hasSignature: false,
        hasMissedMedication: false,
    })
    const [isFilterOpen, setIsFilterOpen] = useState(false)


    // Filter reports based on search query and filter options
    const filteredReports = reports?.filter((report: Report) => {
        // Search query filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const matchesClient = report?.client?.fullName?.toLowerCase().includes(query) || false
            const matchesCareWorker = report?.caregiver?.fullName?.toLowerCase().includes(query) || false
            const matchesAlerts = report?.alerts?.some((alert: ReportAlert) => alert.message.toLowerCase().includes(query)) || false

            if (!(matchesClient || matchesCareWorker || matchesAlerts)) {
                return false
            }
        }

        // Filter options filtering
        if (filterOptions.dateFrom && new Date(report.checkInTime) < new Date(filterOptions.dateFrom)) {
            return false
        }

        if (filterOptions.careWorker && report.caregiver?.fullName !== filterOptions.careWorker) {
            return false
        }

        if (filterOptions.client && report.clientId !== filterOptions.client) {
            return false
        }

        if (filterOptions.taskType && !report.tasksCompleted.some((task: ReportTask) => task.name === filterOptions.taskType)) {
            return false
        }

        if (filterOptions.alertType && !report.alerts?.some((alert: ReportAlert) => alert.type === filterOptions.alertType)) {
            return false
        }

        if (filterOptions.hasSignature && !report.hasSignature) {
            return false
        }

        if (
            filterOptions.hasMissedMedication &&
            !report.alerts?.some((alert: ReportAlert) => alert.type === "medication" && alert.message.toLowerCase().includes("missed"))
        ) {
            return false
        }

        return true
    })

    // Handle export report
    const handleExportReport = () => {
        if (!reports) return

        // Create CSV content
        const headers = ["Client Name", "Date", "Check In", "Check Out", "Summary", "Status"]
        const rows = reports.map((report: Report) => {
            const checkInTime = formatDateFns(new Date(report.checkInTime), "HH:mm")
            const checkOutTime = report.checkOutTime ? formatDateFns(new Date(report.checkOutTime), "HH:mm") : "In Progress"
            const date = formatDateFns(new Date(report.checkInTime), "dd/MM/yyyy")

            return [
                `"${report.client?.fullName || 'Unknown'}"`,
                `"${date}"`,
                `"${checkInTime}"`,
                `"${checkOutTime}"`,
                `"${report.summary || "N/A"}"`,
                `"${report.status}"`,
            ].join(",")
        })

        const csvContent = [headers.join(","), ...rows].join("\n")

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "reports_export.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // Handle view report details
    const handleViewReport = (report: Report) => {
        setSelectedReportState(report)
        setIsDetailViewOpen(true)
    }

    // Handle AI improve report
    const handleAIImprove = (report: Report) => {
        setSelectedReportState(report)
        setIsAIDialogOpen(true)
    }

    const getTaskIcon = (taskName: string) => {
        switch (taskName.toLowerCase()) {
            case "medication":
                return <Pill className="h-3 w-3" />
            case "meal":
                return <Utensils className="h-3 w-3" />
            default:
                return <FileText className="h-3 w-3" />
        }
    }

    const getAlertBadge = (type: string, severity: string) => {
        const severityColors = {
            HIGH: "bg-red-100 text-red-800",
            MEDIUM: "bg-yellow-100 text-yellow-800",
            LOW: "bg-blue-100 text-blue-800",
        }

        return (
            <Badge variant="outline" className={`${severityColors[severity as keyof typeof severityColors] || ""}`}>
                {type}
            </Badge>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">Reports</h1>
                <p className="text-sm text-neutral-600">
                    View and manage your reports.
                </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search reports by client, care worker, tasks, or use AI search like 'show missed medications last week'..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    variant={isFilterOpen ? "default" : "outline"}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="whitespace-nowrap"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </Button>
            </div>

            {isFilterOpen && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Filter content */}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="visits" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="visits">Visit Reports</TabsTrigger>
                    <TabsTrigger value="payroll">Payroll and Invoicing</TabsTrigger>
                    <TabsTrigger value="mileage">Mileage</TabsTrigger>
                </TabsList>

                <TabsContent value="visits" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Visit Reports</CardTitle>
                                    <CardDescription>
                                        {isLoading ? "Loading reports..." : `${filteredReports?.length || 0} reports found`}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Date
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        Care Worker
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Users className="h-4 w-4 mr-2" />
                                        Client
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64 text-red-500">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    {error}
                                </div>
                            ) : !filteredReports || filteredReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No reports found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredReports?.map((report: Report) => (
                                        <div
                                            key={report.id}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                                            onClick={() => handleViewReport(report)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-medium">{report.title || report.summary || "Untitled Report"}</h3>
                                                    <Badge variant="outline">{report.status}</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <UserIcon className="h-4 w-4 mr-1" />
                                                        {report.client?.fullName || "Unknown Client"}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <UserIcon className="h-4 w-4 mr-1" />
                                                        {report.caregiver?.fullName || "Unknown Caregiver"}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(report.checkInTime).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleAIImprove(report)}>
                                                    <Sparkles className="h-4 w-4 mr-1" />
                                                    Improve
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payroll" className="space-y-4">
                    {/* Payroll content */}
                </TabsContent>

                <TabsContent value="mileage" className="space-y-4">
                    {/* Mileage content */}
                </TabsContent>
            </Tabs>

            {/* AI Improve Dialog */}
            {selectedReport && (
                <AIImproveDialog report={selectedReport} open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen} />
            )}
        </div>
    )
}
