"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertCircle,
    Calendar,
    Clock,
    Download,
    Edit,
    FileText,
    Filter,
    MapPin,
    Pill,
    Search,
    Sparkles,
    User,
    Users,
    Utensils,
    X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"
import { ReportDetailView } from "./components/report-detail-view"
import { ReportEditDialog } from "./components/report-edit-dialog"
import { AIImproveDialog } from "./components/ai-improve-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedListItem } from "./components/animated-list-item"
import { AnimatedCard } from "./components/animated-card"
import { AnimatedButton } from "./components/animated-button"
import { Report } from "@/state/api"
import { RootState } from "@/state/redux"

export default function ReportsPage() {
    const dispatch = useDispatch()
    const { reports } = useSelector((state: RootState) => state.report)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("visits")
    const [selectedReport, setSelectedReportState] = useState<Report | null>(null)
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
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
    const filteredReports = reports.filter((report) => {
        // Search query filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const matchesClient = report.client.firstName.toLowerCase().includes(query) ||
                report.client.lastName.toLowerCase().includes(query)
            const matchesCareWorker = report.caregiver.firstName.toLowerCase().includes(query) ||
                report.caregiver.lastName.toLowerCase().includes(query)
            const matchesSummary = report.summary.toLowerCase().includes(query)

            if (!(matchesClient || matchesCareWorker || matchesSummary)) {
                return false
            }
        }

        // Filter options filtering
        if (filterOptions.dateFrom && new Date(report.checkInTime) < new Date(filterOptions.dateFrom)) {
            return false
        }

        if (filterOptions.dateTo && new Date(report.checkInTime) > new Date(filterOptions.dateTo)) {
            return false
        }

        if (filterOptions.careWorker && report.caregiver.id !== filterOptions.careWorker) {
            return false
        }

        if (filterOptions.client && report.clientId !== filterOptions.client) {
            return false
        }

        if (filterOptions.taskType && !report.tasksCompleted.some((task) => task.taskName === filterOptions.taskType)) {
            return false
        }

        return true
    })

    // Handle export report
    const handleExportReport = () => {
        toast.success("Report exported successfully")
    }

    // Handle view report details
    const handleViewReport = (report: Report) => {
        setSelectedReportState(report)
        setIsDetailViewOpen(true)
    }

    // Handle edit report
    const handleEditReport = (report: Report) => {
        setSelectedReportState(report)
        setIsEditDialogOpen(true)
    }

    // Handle AI improve report
    const handleAIImprove = (report: Report) => {
        setSelectedReportState(report)
        setIsAIDialogOpen(true)
    }

    // Reset filters
    const resetFilters = () => {
        setFilterOptions({
            dateFrom: "",
            dateTo: "",
            careWorker: "",
            client: "",
            taskType: "",
            alertType: "",
            hasSignature: false,
            hasMissedMedication: false,
        })
        setIsFilterOpen(false)
    }

    // Get task icon component
    const getTaskIcon = (taskName: string) => {
        switch (taskName.toLowerCase()) {
            case "medication":
                return <Pill className="h-4 w-4" />
            case "food":
                return <Utensils className="h-4 w-4" />
            case "companionship":
                return <Users className="h-4 w-4" />
            case "personal care":
                return <User className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <AnimatedButton onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </AnimatedButton>
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <motion.div
                    className="relative flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search reports by client, care worker, tasks, or use AI search like 'show missed medications last week'..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>
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
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Card className="mb-4 overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle>Filter Reports</CardTitle>
                                <Button variant="ghost" size="sm" onClick={resetFilters}>
                                    <X className="h-4 w-4 mr-1" /> Reset
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFrom">Date From</Label>
                                    <Input
                                        id="dateFrom"
                                        type="date"
                                        value={filterOptions.dateFrom}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, dateFrom: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateTo">Date To</Label>
                                    <Input
                                        id="dateTo"
                                        type="date"
                                        value={filterOptions.dateTo}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, dateTo: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="careWorker">Care Worker</Label>
                                    <Select
                                        value={filterOptions.careWorker}
                                        onValueChange={(value) => setFilterOptions({ ...filterOptions, careWorker: value })}
                                    >
                                        <SelectTrigger id="careWorker">
                                            <SelectValue placeholder="Select care worker" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Sarah Smith</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <Select
                                        value={filterOptions.client}
                                        onValueChange={(value) => setFilterOptions({ ...filterOptions, client: value })}
                                    >
                                        <SelectTrigger id="client">
                                            <SelectValue placeholder="Select client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">John Doe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="taskType">Task Type</Label>
                                    <Select
                                        value={filterOptions.taskType}
                                        onValueChange={(value) => setFilterOptions({ ...filterOptions, taskType: value })}
                                    >
                                        <SelectTrigger id="taskType">
                                            <SelectValue placeholder="Select task type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Medication">Medication</SelectItem>
                                            <SelectItem value="Personal Care">Personal Care</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alertType">Alert Type</Label>
                                    <Select
                                        value={filterOptions.alertType}
                                        onValueChange={(value) => setFilterOptions({ ...filterOptions, alertType: value })}
                                    >
                                        <SelectTrigger id="alertType">
                                            <SelectValue placeholder="Select alert type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medication">Medication Alert</SelectItem>
                                            <SelectItem value="incident">Incident Alert</SelectItem>
                                            <SelectItem value="other">Other Alert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2 pt-6">
                                    <Checkbox
                                        id="hasSignature"
                                        checked={filterOptions.hasSignature}
                                        onCheckedChange={(checked) =>
                                            setFilterOptions({ ...filterOptions, hasSignature: checked === true })
                                        }
                                    />
                                    <Label htmlFor="hasSignature">Has Client Signature</Label>
                                </div>

                                <div className="flex items-center space-x-2 pt-6">
                                    <Checkbox
                                        id="hasMissedMedication"
                                        checked={filterOptions.hasMissedMedication}
                                        onCheckedChange={(checked) =>
                                            setFilterOptions({ ...filterOptions, hasMissedMedication: checked === true })
                                        }
                                    />
                                    <Label htmlFor="hasMissedMedication">Missed Medication</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Tabs defaultValue="visits" onValueChange={setActiveTab}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="visits">Visit Reports</TabsTrigger>
                        <TabsTrigger value="payroll">Payroll and Invoicing</TabsTrigger>
                        <TabsTrigger value="mileage">Mileage</TabsTrigger>
                    </TabsList>
                </motion.div>

                <TabsContent value="visits" className="space-y-4">
                    <AnimatedCard delay={0.1}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Visit Reports</CardTitle>
                                    <CardDescription>{filteredReports.length} reports found</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Date
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <User className="h-4 w-4 mr-2" />
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
                            {filteredReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No reports found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {filteredReports.map((report, index) => (
                                            <AnimatedListItem key={report.id} index={index} onClick={() => handleViewReport(report)}>
                                                <div className="w-full flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                                                    <div className="flex items-center space-x-4 mb-4 md:mb-0 flex-grow">
                                                        <div className="flex flex-col items-center text-center">
                                                            <span className="text-sm font-medium">{format(new Date(report.checkInTime), "EEE")}</span>
                                                            <span className="text-lg font-bold">{format(new Date(report.checkInTime), "d")}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(report.checkInTime), "MMM")}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center">
                                                                <h4 className="font-medium">{report.client.firstName} {report.client.lastName}</h4>
                                                                {report.hasSignature && (
                                                                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                                                        Signed
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                <span>
                                                                    {format(new Date(report.checkInTime), "h:mm a")} - {report.checkOutTime ? format(new Date(report.checkOutTime), "h:mm a") : "Not checked out"}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <User className="h-3 w-3 mr-1" />
                                                                <span>{report.caregiver.firstName} {report.caregiver.lastName}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-2">
                                                        <div className="flex flex-wrap gap-1">
                                                            {report.tasksCompleted.map((task) => (
                                                                <Badge key={task.id} variant="secondary" className="flex items-center">
                                                                    {getTaskIcon(task.taskName)}
                                                                    <span className="ml-1">{task.taskName}</span>
                                                                </Badge>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-end space-x-2 mt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleAIImprove(report)
                                                                }}
                                                            >
                                                                <Sparkles className="h-3 w-3 mr-1" />
                                                                AI Improve
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleEditReport(report)
                                                                }}
                                                            >
                                                                <Edit className="h-3 w-3 mr-1" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AnimatedListItem>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-6">
                            <div className="text-sm text-muted-foreground">Care hours: 1h 30m</div>
                            <Button variant="outline" onClick={handleExportReport}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Reports
                            </Button>
                        </CardFooter>
                    </AnimatedCard>
                </TabsContent>

                <TabsContent value="payroll" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payroll and Invoicing</CardTitle>
                            <CardDescription>Manage payroll and invoicing reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Payroll Reports</h3>
                                <p className="text-muted-foreground mb-6">Generate and manage payroll reports for your care workers</p>
                                <Button>Generate Payroll Report</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mileage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mileage Reports</CardTitle>
                            <CardDescription>Track and manage mileage reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Mileage Tracking</h3>
                                <p className="text-muted-foreground mb-6">View and export mileage reports for reimbursement</p>
                                <Button>Generate Mileage Report</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Report Detail View */}
            {selectedReport && (
                <ReportDetailView
                    report={selectedReport}
                    open={isDetailViewOpen}
                    onOpenChange={setIsDetailViewOpen}
                    onEdit={() => {
                        setIsDetailViewOpen(false)
                        setIsEditDialogOpen(true)
                    }}
                    onAIImprove={() => {
                        setIsDetailViewOpen(false)
                        setIsAIDialogOpen(true)
                    }}
                />
            )}

            {/* Report Edit Dialog */}
            {selectedReport && (
                <ReportEditDialog report={selectedReport} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
            )}

            {/* AI Improve Dialog */}
            {selectedReport && (
                <AIImproveDialog report={selectedReport} open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen} />
            )}
        </div>
    )
}
