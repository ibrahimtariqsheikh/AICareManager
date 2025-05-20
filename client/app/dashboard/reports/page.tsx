"use client"

import { useAppSelector } from "@/hooks/useAppSelector"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { AlertCircle, CheckCircle, Clock, FileEdit, Flag, Search, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CustomInput } from "@/components/ui/custom-input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function ReportsPage() {
    const { agency } = useAppSelector((state: any) => state.agency)
    const reports = agency?.reports || []
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)
    const [alertFilter, setAlertFilter] = useState("all")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [alertType, setAlertType] = useState("all")
    const [lastRefreshed, setLastRefreshed] = useState(new Date())
    const [showFilters, setShowFilters] = useState(false)
    const [resolutionText, setResolutionText] = useState("")
    const [selectedAlert, setSelectedAlert] = useState<any>(null)
    const [reportFilter, setReportFilter] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Report filters
    const [showReportFilters, setShowReportFilters] = useState(false)
    const [reportFromDate, setReportFromDate] = useState("")
    const [reportToDate, setReportToDate] = useState("")
    const [selectedClient, setSelectedClient] = useState("all")
    const [selectedCareWorker, setSelectedCareWorker] = useState("all")
    const [selectedGroup, setSelectedGroup] = useState("all")
    const [selectedTask, setSelectedTask] = useState("all")

    // Dummy data for filters
    const clients = [
        { id: "1", name: "Ayan Khalid" },
        { id: "2", name: "Salem Khalid" },
        { id: "3", name: "John Doe" }
    ]

    const careWorkers = [
        { id: "1", name: "Sarah Smith" },
        { id: "2", name: "Mike Johnson" },
        { id: "3", name: "Emma Wilson" }
    ]

    const groups = [
        { id: "1", name: "Morning Shift" },
        { id: "2", name: "Evening Shift" },
        { id: "3", name: "Night Shift" }
    ]

    const tasks = [
        { id: "1", name: "Medication" },
        { id: "2", name: "Personal Care" },
        { id: "3", name: "Meal Preparation" }
    ]

    // Reports summary data
    const reportsSummary = {
        all: { count: 0, total: 0 },
        flagged: { count: 0, total: 0 },
        reviewed: { count: 0, total: 0 },
        completed: { count: 0, total: 0 }
    }

    // Calculate report summaries
    useEffect(() => {
        if (reports.length > 0) {
            const summary = {
                all: { count: reports.length, total: reports.length },
                flagged: { count: 0, total: reports.length },
                reviewed: { count: 0, total: reports.length },
                completed: { count: 0, total: reports.length }
            }

            reports.forEach((report: any) => {
                const status = report.status?.toLowerCase()
                if (status && summary[status as keyof typeof summary]) {
                    summary[status as keyof typeof summary].count++
                }
            })

            Object.assign(reportsSummary, summary)
        }
    }, [reports])

    // Enhanced alerts data based on the screenshot
    const enhancedAlerts = [
        {
            id: 1,
            date: "18/05/25, 16:00",
            type: "MEDICATION",
            client: { fullName: "ayan khalid" },
            details: "It looks as though one of the Lunchtime medications have not yet been reported for ayan",
            status: "UNRESOLVED"
        },
        {
            id: 2,
            date: "18/05/25, 12:00",
            type: "MEDICATION",
            client: { fullName: "ayan khalid" },
            details: "It looks as though one of the Morning medications have not yet been reported for ayan",
            status: "UNRESOLVED"
        },
        {
            id: 3,
            date: "18/05/25, 09:00",
            type: "MEDICATION",
            client: { fullName: "Salem Khalid" },
            details: "It looks as though one of the Bedtime medications have not yet been reported for Salem",
            status: "UNRESOLVED"
        }
    ]

    // Alerts summary data
    const alertsSummary = {
        all: { count: 0, total: 0 },
        resolved: { count: 0, total: 0 },
        overdue: { count: 0, total: 0 },
        categories: {
            incident: { count: 0, total: 0 },
            medication: { count: 0, total: 0 },
            distance: { count: 0, total: 0 },
            lateVisit: { count: 0, total: 0 },
            other: { count: 0, total: 0 }
        }
    }

    // Calculate alerts summary
    useEffect(() => {
        if (enhancedAlerts.length > 0) {
            const summary = {
                all: { count: enhancedAlerts.length, total: enhancedAlerts.length },
                resolved: { count: 0, total: enhancedAlerts.length },
                overdue: { count: 0, total: enhancedAlerts.length },
                categories: {
                    incident: { count: 0, total: enhancedAlerts.length },
                    medication: { count: 0, total: enhancedAlerts.length },
                    distance: { count: 0, total: enhancedAlerts.length },
                    lateVisit: { count: 0, total: enhancedAlerts.length },
                    other: { count: 0, total: enhancedAlerts.length }
                }
            }

            enhancedAlerts.forEach((alert: any) => {
                // Count by type
                const type = alert.type?.toLowerCase()
                if (type && summary.categories[type as keyof typeof summary.categories]) {
                    summary.categories[type as keyof typeof summary.categories].count++
                } else {
                    summary.categories.other.count++
                }

                // Count resolved
                if (alert.status?.toLowerCase() === 'resolved') {
                    summary.resolved.count++
                }

                // Count overdue (you can add your overdue logic here)
                if (alert.isOverdue) {
                    summary.overdue.count++
                }
            })

            Object.assign(alertsSummary, summary)
        }
    }, [enhancedAlerts])

    // Dummy alerts data from original code

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const handleRefresh = () => {
        setLastRefreshed(new Date())
        // Here you would typically fetch new data
    }

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



    const filteredReports = (status?: string) => {
        let filtered = reports

        // Status filter
        if (status && status !== "all") {
            filtered = reports.filter((report: any) => report.status === status.toUpperCase())
        }

        // Date range filter
        if (reportFromDate) {
            filtered = filtered.filter((report: any) =>
                new Date(report.checkInTime) >= new Date(reportFromDate)
            )
        }
        if (reportToDate) {
            filtered = filtered.filter((report: any) =>
                new Date(report.checkInTime) <= new Date(reportToDate)
            )
        }

        // Client filter
        if (selectedClient !== "all") {
            filtered = filtered.filter((report: any) =>
                report.client?.id === selectedClient
            )
        }

        // Care worker filter
        if (selectedCareWorker !== "all") {
            filtered = filtered.filter((report: any) =>
                report.caregiver?.id === selectedCareWorker
            )
        }

        // Group filter
        if (selectedGroup !== "all") {
            filtered = filtered.filter((report: any) =>
                report.group?.id === selectedGroup
            )
        }

        // Task filter
        if (selectedTask !== "all") {
            filtered = filtered.filter((report: any) =>
                report.task?.id === selectedTask
            )
        }

        // Search term filter
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

    const filteredAlerts = () => {
        let filtered = enhancedAlerts

        if (alertFilter !== "all") {
            filtered = filtered.filter(alert => alert.status.toLowerCase() === alertFilter.toLowerCase())
        }

        if (alertType !== "all") {
            filtered = filtered.filter(alert => alert.type.toLowerCase() === alertType.toLowerCase())
        }

        // Date filtering would go here if implemented

        if (searchTerm) {
            filtered = filtered.filter(
                alert =>
                    (alert.client?.fullName && alert.client.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (alert.details && alert.details.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        return filtered
    }

    const handleAddResolution = () => {
        // Here you would typically make an API call to save the resolution
        console.log("Adding resolution:", resolutionText, "for alert:", selectedAlert)
        setResolutionText("")
        setSelectedAlert(null)
    }

    const renderReportItem = (report: any) => (
        <tr key={report.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
            <td className="py-1.5 px-2">
                <Link href={`/dashboard/reports/${report.id}`} className="block">
                    <h3 className="font-medium text-sm">{report.title || "Untitled Report"}</h3>
                </Link>
            </td>
            <td className="py-1.5 px-2">
                <Badge variant="outline" className={cn("text-xs font-medium", getStatusColor(report.status))}>
                    {getStatusIcon(report.status)}
                    {report.status}
                </Badge>
            </td>
            <td className="py-1.5 px-2 text-sm text-muted-foreground">{report.client?.fullName}</td>
            <td className="py-1.5 px-2 text-sm text-muted-foreground">{report.caregiver?.fullName}</td>
            <td className="py-1.5 px-2 text-sm text-muted-foreground">
                {format(new Date(report.checkInTime), "MMM dd, HH:mm")}
            </td>
            <td className="py-1.5 px-2 text-right">
                <Button variant="outline" size="sm" className="h-6" asChild>
                    <Link href={`/dashboard/reports/${report.id}`}>
                        <span className="flex items-center">
                            <FileEdit className="h-3 w-3 mr-1" />
                            View
                        </span>
                    </Link>
                </Button>
            </td>
        </tr>
    )


    const renderReportSummaryCard = (title: string, count: number, total: number, icon: React.ReactNode, color: string) => (
        <Card className="h-full">
            <CardContent className="flex flex-col justify-between p-4 h-full">
                <div className="text-muted-foreground text-sm mb-1">{title}</div>
                <div className="flex flex-col">
                    <div className="text-2xl font-semibold mb-0.5">{count}</div>
                    <div className="text-xs text-muted-foreground">{total} total</div>
                </div>
                <div className="absolute top-4 right-4">{icon}</div>
            </CardContent>
        </Card>
    )

    const renderAlertCategoryCard = (title: string, count: number, total: number, icon: React.ReactNode, color: string, description?: string) => (
        <Card className="h-full">
            <CardContent className="flex flex-col justify-between p-4 h-full">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-muted-foreground text-sm mb-0.5">{title}</div>
                        {description && <div className="text-xs text-muted-foreground">{description}</div>}
                    </div>
                    <div className={`p-1.5 rounded-full bg-${color}-100`}>
                        {icon}
                    </div>
                </div>
                <div className="mt-2">
                    <div className="text-2xl font-semibold mb-0.5">{count}</div>
                    <div className="text-xs text-muted-foreground">{total} total</div>
                </div>
            </CardContent>
        </Card>
    )

    const renderEnhancedAlertItem = (alert: any) => (
        <tr key={alert.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
            <td className="py-1.5 px-2 text-sm">{alert.date}</td>
            <td className="py-1.5 px-2">
                <Badge variant="outline" className={cn(
                    "text-xs font-medium",
                    alert.type === 'MEDICATION' ? 'bg-red-100 text-red-800 border-red-200' : ''
                )}>
                    Medication alert
                </Badge>
            </td>
            <td className="py-1.5 px-2 text-sm text-primary">{alert.client.fullName}</td>
            <td className="py-1.5 px-2 text-sm text-muted-foreground">{alert.details}</td>
            <td className="py-1.5 px-2 text-right">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-6"
                            onClick={() => setSelectedAlert(alert)}
                        >
                            <span className="flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Add resolution
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Resolution</DialogTitle>
                            <DialogDescription>
                                Add a resolution for the alert regarding {alert.client.fullName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="resolution" className="text-sm font-medium">
                                    Resolution Details
                                </label>
                                <Textarea
                                    id="resolution"
                                    placeholder="Enter resolution details..."
                                    value={resolutionText}
                                    onChange={(e) => setResolutionText(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedAlert(null)
                                        setResolutionText("")
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button onClick={handleAddResolution}>
                                    Save Resolution
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </td>
        </tr>
    )

    // Calculate report summaries based on current filters
    const getFilteredReportsSummary = () => {
        const filtered = filteredReports()
        const summary = {
            all: { count: filtered.length, total: reports.length },
            flagged: { count: 0, total: reports.length },
            reviewed: { count: 0, total: reports.length },
            completed: { count: 0, total: reports.length }
        }

        filtered.forEach((report: any) => {
            const status = report.status?.toLowerCase()
            if (status && summary[status as keyof typeof summary]) {
                summary[status as keyof typeof summary].count++
            }
        })

        return summary
    }

    const currentReportsSummary = getFilteredReportsSummary()

    // Calculate alerts summary based on current filters
    const getFilteredAlertsSummary = () => {
        const filtered = filteredAlerts()
        const summary = {
            all: { count: filtered.length, total: enhancedAlerts.length },
            resolved: { count: 0, total: enhancedAlerts.length },
            overdue: { count: 0, total: enhancedAlerts.length },
            categories: {
                incident: { count: 0, total: enhancedAlerts.length },
                medication: { count: 0, total: enhancedAlerts.length },
                distance: { count: 0, total: enhancedAlerts.length },
                lateVisit: { count: 0, total: enhancedAlerts.length },
                other: { count: 0, total: enhancedAlerts.length }
            }
        }

        filtered.forEach((alert: any) => {
            // Count by type
            const type = alert.type?.toLowerCase()
            if (type && summary.categories[type as keyof typeof summary.categories]) {
                summary.categories[type as keyof typeof summary.categories].count++
            } else {
                summary.categories.other.count++
            }

            // Count resolved
            if (alert.status?.toLowerCase() === 'resolved') {
                summary.resolved.count++
            }

            // Count overdue (you can add your overdue logic here)
            if (alert.isOverdue) {
                summary.overdue.count++
            }
        })

        return summary
    }

    const currentAlertsSummary = getFilteredAlertsSummary()

    return (
        <div className={`relative min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
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
                            {/* Reports Dashboard */}
                            <div className="space-y-6">
                                {/* Report Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {renderReportSummaryCard(
                                        "All Reports",
                                        currentReportsSummary.all.count,
                                        currentReportsSummary.all.total,
                                        <FileEdit className="h-5 w-5 text-gray-500" />,
                                        "gray"
                                    )}
                                    {renderReportSummaryCard(
                                        "Flagged",
                                        currentReportsSummary.flagged.count,
                                        currentReportsSummary.flagged.total,
                                        <Flag className="h-5 w-5 text-red-500" />,
                                        "red"
                                    )}
                                    {renderReportSummaryCard(
                                        "Reviewed",
                                        currentReportsSummary.reviewed.count,
                                        currentReportsSummary.reviewed.total,
                                        <AlertCircle className="h-5 w-5 text-purple-500" />,
                                        "purple"
                                    )}
                                    {renderReportSummaryCard(
                                        "Completed",
                                        currentReportsSummary.completed.count,
                                        currentReportsSummary.completed.total,
                                        <CheckCircle className="h-5 w-5 text-green-500" />,
                                        "green"
                                    )}
                                </div>

                                {/* Report Type Tabs */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={reportFilter === "all" ? "default" : "outline"}
                                            onClick={() => setReportFilter("all")}
                                            className="rounded-md"
                                        >
                                            All Reports
                                        </Button>
                                        <Button
                                            variant={reportFilter === "flagged" ? "default" : "outline"}
                                            onClick={() => setReportFilter("flagged")}
                                            className="rounded-md"
                                        >
                                            Flagged
                                        </Button>
                                        <Button
                                            variant={reportFilter === "reviewed" ? "default" : "outline"}
                                            onClick={() => setReportFilter("reviewed")}
                                            className="rounded-md"
                                        >
                                            Reviewed
                                        </Button>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-muted-foreground flex items-center">
                                            Last refreshed: {format(lastRefreshed, "HH:mm")}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2 h-8 w-8"
                                                onClick={handleRefresh}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowReportFilters(!showReportFilters)}
                                            className="rounded-md"
                                        >
                                            <span className="flex items-center">
                                                <Search className="h-4 w-4 mr-1" />
                                                {showReportFilters ? "Hide Filters" : "Show Filters"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Report Filters */}
                                {showReportFilters && (
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">Client</label>
                                                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                                                        <SelectTrigger className="w-full h-9">
                                                            <SelectValue placeholder="All clients" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All clients</SelectItem>
                                                            {clients.map((client) => (
                                                                <SelectItem key={client.id} value={client.id}>
                                                                    {client.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">Care Worker</label>
                                                    <Select value={selectedCareWorker} onValueChange={setSelectedCareWorker}>
                                                        <SelectTrigger className="w-full h-9">
                                                            <SelectValue placeholder="All care workers" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All care workers</SelectItem>
                                                            {careWorkers.map((worker) => (
                                                                <SelectItem key={worker.id} value={worker.id}>
                                                                    {worker.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">From date</label>
                                                    <Input
                                                        type="date"
                                                        value={reportFromDate}
                                                        onChange={(e) => setReportFromDate(e.target.value)}
                                                        className="w-full h-9"
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">To date</label>
                                                    <Input
                                                        type="date"
                                                        value={reportToDate}
                                                        onChange={(e) => setReportToDate(e.target.value)}
                                                        className="w-full h-9"
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Reports Table */}
                                {filteredReports(reportFilter === "all" ? undefined : reportFilter.toUpperCase()).length > 0 ? (
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border bg-muted/50">
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Caregiver</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                                            <th className="py-1.5 px-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredReports(reportFilter === "all" ? undefined : reportFilter.toUpperCase()).map(renderReportItem)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="text-center py-16 border-dashed">
                                        <CardContent className="pt-16">
                                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-md">
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
                            </div>
                        </TabsContent>

                        <TabsContent value="flagged" className="space-y-4 mt-6">
                            {/* Flagged Reports Dashboard */}
                            <div className="space-y-6">
                                {filteredReports("FLAGGED").length > 0 ? (
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border bg-muted/50">
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Caregiver</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                                            <th className="py-1.5 px-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredReports("FLAGGED").map(renderReportItem)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="text-center py-16 border-dashed">
                                        <CardContent className="pt-16">
                                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-md">
                                                <Flag className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-lg mb-1">
                                                No flagged reports
                                            </CardTitle>
                                            <CardDescription>
                                                Reports that need attention will appear here
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="reviewed" className="space-y-4 mt-6">
                            {/* Reviewed Reports Dashboard */}
                            <div className="space-y-6">
                                {filteredReports("REVIEWED").length > 0 ? (
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-border bg-muted/50">
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Caregiver</th>
                                                            <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                                            <th className="py-1.5 px-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredReports("REVIEWED").map(renderReportItem)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="text-center py-16 border-dashed">
                                        <CardContent className="pt-16">
                                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted rounded-md">
                                                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <CardTitle className="text-lg mb-1">
                                                No reviewed reports
                                            </CardTitle>
                                            <CardDescription>
                                                Reports that have been reviewed will appear here
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-6 mt-6">
                            {/* Alerts Dashboard */}
                            <div className="space-y-6">

                                {/* Alert Summary Cards */}
                                <div className="space-y-6">
                                    {/* Main Alert Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {renderAlertCategoryCard(
                                            "All Alerts",
                                            currentAlertsSummary.all.count,
                                            currentAlertsSummary.all.total,
                                            <AlertCircle className="h-5 w-5 text-gray-500" />,
                                            "gray"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Resolved Alerts",
                                            currentAlertsSummary.resolved.count,
                                            currentAlertsSummary.resolved.total,
                                            <CheckCircle className="h-5 w-5 text-green-500" />,
                                            "green"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Overdue Alerts",
                                            currentAlertsSummary.overdue.count,
                                            currentAlertsSummary.overdue.total,
                                            <Clock className="h-5 w-5 text-red-500" />,
                                            "red"
                                        )}
                                    </div>

                                    {/* Alert Categories */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {renderAlertCategoryCard(
                                            "Incident Alerts",
                                            currentAlertsSummary.categories.incident.count,
                                            currentAlertsSummary.categories.incident.total,
                                            <AlertCircle className="h-5 w-5 text-orange-500" />,
                                            "orange",
                                            "Safety incidents"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Medication Alerts",
                                            currentAlertsSummary.categories.medication.count,
                                            currentAlertsSummary.categories.medication.total,
                                            <AlertCircle className="h-5 w-5 text-red-500" />,
                                            "red",
                                            "Medication issues"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Distance Alerts",
                                            currentAlertsSummary.categories.distance.count,
                                            currentAlertsSummary.categories.distance.total,
                                            <AlertCircle className="h-5 w-5 text-blue-500" />,
                                            "blue",
                                            "Location tracking"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Late Visit Alerts",
                                            currentAlertsSummary.categories.lateVisit.count,
                                            currentAlertsSummary.categories.lateVisit.total,
                                            <Clock className="h-5 w-5 text-yellow-500" />,
                                            "yellow",
                                            "Visit timing"
                                        )}
                                        {renderAlertCategoryCard(
                                            "Other Alerts",
                                            currentAlertsSummary.categories.other.count,
                                            currentAlertsSummary.categories.other.total,
                                            <AlertCircle className="h-5 w-5 text-purple-500" />,
                                            "purple",
                                            "Miscellaneous"
                                        )}
                                    </div>
                                </div>

                                {/* Alert Status Tabs */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={alertFilter === "all" ? "default" : "outline"}
                                            onClick={() => setAlertFilter("all")}
                                            className="rounded-md"
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={alertFilter === "unresolved" ? "default" : "outline"}
                                            onClick={() => setAlertFilter("unresolved")}
                                            className="rounded-md"
                                        >
                                            Unresolved
                                        </Button>
                                        <Button
                                            variant={alertFilter === "resolved" ? "default" : "outline"}
                                            onClick={() => setAlertFilter("resolved")}
                                            className="rounded-md"
                                        >
                                            Resolved
                                        </Button>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-muted-foreground flex items-center">
                                            Last refreshed: {format(lastRefreshed, "HH:mm")}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2 h-8 w-8"
                                                onClick={handleRefresh}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="rounded-md"
                                        >
                                            <span className="flex items-center">
                                                <Search className="h-4 w-4 mr-1" />
                                                {showFilters ? "Hide Filters" : "Show Filters"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Filters */}
                                {showFilters && (
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">Alert type</label>
                                                    <Select value={alertType} onValueChange={setAlertType}>
                                                        <SelectTrigger className="w-full h-9">
                                                            <SelectValue placeholder="All types" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All types</SelectItem>
                                                            <SelectItem value="medication">Medication</SelectItem>
                                                            <SelectItem value="safety">Safety</SelectItem>
                                                            <SelectItem value="distance">Distance</SelectItem>
                                                            <SelectItem value="report">Report</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">From date</label>
                                                    <Input
                                                        type="date"
                                                        value={fromDate}
                                                        onChange={(e) => setFromDate(e.target.value)}
                                                        className="w-full h-9"
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1.5">To date</label>
                                                    <Input
                                                        type="date"
                                                        value={toDate}
                                                        onChange={(e) => setToDate(e.target.value)}
                                                        className="w-full h-9"
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Alerts Table */}
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-border bg-muted/50">
                                                        <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                                        <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                                        <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                                        <th className="py-1.5 px-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                                                        <th className="py-1.5 px-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredAlerts().length > 0 ? (
                                                        filteredAlerts().map(renderEnhancedAlertItem)
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                                                No alerts match your criteria
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}