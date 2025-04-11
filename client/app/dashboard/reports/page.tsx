"use client"

import { useState, useEffect } from "react"
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
    Eye,
    FileText,
    Filter,
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
import { format as formatDateFns } from "date-fns"
import { AIImproveDialog } from "./components/ai-improve-dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetAgencyReportsQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import type { Report } from "../types"
import { CalendarIcon } from "lucide-react"
import { Calendar as DatePicker } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button as PopoverButton } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

// Mock data types
interface UserType {
    id: string
    name: string
    role: string
    avatar?: string
}

interface Task {
    id: string
    name: string
    completed: boolean
    icon: string
}

interface PayrollEntry {
    id: string
    name: string
    actualDuration: string
    actualCharge: string
    scheduledDuration: string
    scheduledCharge: string
}

export default function ReportsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("visits")
    const [isLoading, setIsLoading] = useState(true)
    const [selectedReport, setSelectedReportState] = useState<Report | null>(null)
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
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
    const agencyId = useAppSelector((state) => state.user.user.userInfo?.agency?.id)
    const { data: reports, isLoading: isReportsLoading } = useGetAgencyReportsQuery(agencyId as string)
    const clients = useAppSelector((state) => state.user.clients)
    const careWorkers = useAppSelector((state) => state.user.careWorkers)

    console.log("reports", reports)
    console.log("clients", clients)
    console.log("careWorkers", careWorkers)

    const router = useRouter()

    const [payrollData, setPayrollData] = useState<PayrollEntry[]>([])
    const [payrollFilterType, setPayrollFilterType] = useState<"clients" | "careWorkers">("clients")
    const [payrollDateRange, setPayrollDateRange] = useState({
        from: new Date(2025, 3, 1), // April 1, 2025
        to: new Date(2025, 3, 10), // April 10, 2025
    })
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [showArchivedClients, setShowArchivedClients] = useState(false)

    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })

    // Update filter options when date range changes
    useEffect(() => {
        if (date?.from && date?.to) {
            setFilterOptions({
                ...filterOptions,
                dateFrom: date.from.toISOString(),
                dateTo: date.to.toISOString(),
            })
        }
    }, [date])

    // Mock data for reports
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            // Mock payroll data
            const mockPayrollData: PayrollEntry[] =
                (payrollFilterType === "clients" ? clients : careWorkers)?.map((user) => ({
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    actualDuration: "00:00",
                    actualCharge: "£0.00",
                    scheduledDuration: "00:00",
                    scheduledCharge: "£0.00",
                })) || []

            setPayrollData(mockPayrollData)
            setIsLoading(false)
        }, 1000)
    }, [clients, careWorkers, payrollFilterType])

    // Reset selected users when switching between clients and care workers
    useEffect(() => {
        setSelectedClients([])
    }, [payrollFilterType])

    // Calculate totals for payroll
    const payrollTotals = payrollData.reduce(
        (acc, entry) => {
            return {
                actualDuration: acc.actualDuration,
                actualCharge: (
                    Number.parseFloat(acc.actualCharge.replace("£", "")) + Number.parseFloat(entry.actualCharge.replace("£", ""))
                ).toFixed(2),
                scheduledDuration: acc.scheduledDuration,
                scheduledCharge: (
                    Number.parseFloat(acc.scheduledCharge.replace("£", "")) +
                    Number.parseFloat(entry.scheduledCharge.replace("£", ""))
                ).toFixed(2),
            }
        },
        { actualDuration: "00:12", actualCharge: "£0.00", scheduledDuration: "44:00", scheduledCharge: "£0.00" },
    )

    // Filter reports based on search query and filter options
    const filteredReports = reports?.filter((report: Report) => {
        // Search query filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const matchesClient = report?.client?.firstName?.toLowerCase().includes(query) || false
            const matchesCareWorker = report?.caregiver?.firstName?.toLowerCase().includes(query) || false

            const matchesAlerts = report?.alerts?.some((alert) => alert.message.toLowerCase().includes(query)) || false

            if (!(matchesClient || matchesCareWorker || matchesAlerts)) {
                return false
            }
        }

        // Filter options filtering
        if (filterOptions.dateFrom && new Date(report.checkInTime) < new Date(filterOptions.dateFrom)) {
            return false
        }

        if (filterOptions.careWorker && report.caregiver?.firstName !== filterOptions.careWorker) {
            return false
        }

        if (filterOptions.client && report.clientId !== filterOptions.client) {
            return false
        }

        if (filterOptions.taskType && !report.tasksCompleted.some((task) => task.name === filterOptions.taskType)) {
            return false
        }

        if (filterOptions.alertType && !report.alerts?.some((alert) => alert.type === filterOptions.alertType)) {
            return false
        }

        if (filterOptions.hasSignature && !report.hasSignature) {
            return false
        }

        if (
            filterOptions.hasMissedMedication &&
            !report.alerts?.some((alert) => alert.type === "medication" && alert.message.toLowerCase().includes("missed"))
        ) {
            return false
        }

        return true
    })

    // Handle export report
    const handleExportReport = () => {
        if (!reports || !clients) return

        // Create CSV content
        const headers = ["Client Name", "Date", "Check In", "Check Out", "Summary", "Status"]
        const rows = reports.map((report) => {
            const client = clients.find((c) => c.id === report.clientId)
            const checkInTime = formatDateFns(new Date(report.checkInTime), "HH:mm")
            const checkOutTime = report.checkOutTime ? formatDateFns(new Date(report.checkOutTime), "HH:mm") : "In Progress"
            const date = formatDateFns(new Date(report.checkInTime), "dd/MM/yyyy")

            return [
                `"${client?.firstName} ${client?.lastName}"`,
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
            case "utensils":
                return <Utensils className="h-4 w-4" />
            case "users":
                return <Users className="h-4 w-4" />
            case "user":
                return <User className="h-4 w-4" />
            case "coffee":
                return <div className="h-4 w-4">☕</div>
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    // Get alert badge
    const getAlertBadge = (type: string, severity: string) => {
        let color = ""
        let icon = null

        switch (type) {
            case "medication":
                icon = <Pill className="h-3 w-3 mr-1" />
                color = severity === "high" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                break
            case "incident":
                icon = <AlertCircle className="h-3 w-3 mr-1" />
                color = "bg-red-100 text-red-800"
                break
            default:
                icon = <AlertCircle className="h-3 w-3 mr-1" />
                color = "bg-blue-100 text-blue-800"
        }

        return (
            <Badge variant="outline" className={`${color} flex items-center`}>
                {icon} {type.charAt(0).toUpperCase() + type.slice(1)} Alert
            </Badge>
        )
    }

    // Toggle client selection
    const toggleClientSelection = (clientId: string) => {
        if (selectedClients.includes(clientId)) {
            setSelectedClients(selectedClients.filter((id) => id !== clientId))
        } else {
            setSelectedClients([...selectedClients, clientId])
        }
    }

    // Select all clients
    const selectAllClients = () => {
        if (selectedClients.length === payrollData.length) {
            setSelectedClients([])
        } else {
            setSelectedClients(payrollData.map((client) => client.id))
        }
    }

    return (
        <div className="flex-1 space-y-4 p-6 ">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
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
                <Card className="mb-4">
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
                                <Label>Date Range</Label>
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <PopoverButton
                                                variant="outline"
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !date && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {formatDateFns(date.from, "LLL dd, y")} - {formatDateFns(date.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        formatDateFns(date.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date range</span>
                                                )}
                                            </PopoverButton>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <DatePicker
                                                initialFocus
                                                mode="range"
                                                defaultMonth={date?.from}
                                                selected={date}
                                                onSelect={setDate}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {date && (
                                        <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>
                                            Clear
                                        </Button>
                                    )}
                                </div>
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
                                        {careWorkers?.map((worker) => (
                                            <SelectItem key={worker.id} value={worker.id}>
                                                {worker.firstName} {worker.lastName}
                                            </SelectItem>
                                        ))}
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
                                        {clients?.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.firstName} {client.lastName}
                                            </SelectItem>
                                        ))}
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
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Companionship">Companionship</SelectItem>
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
                                    onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, hasSignature: checked === true })}
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
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-md animate-pulse">
                                            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : !filteredReports || filteredReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No reports found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredReports?.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                                            onClick={() => handleViewReport(report)}
                                        >
                                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="text-sm font-medium">
                                                        {formatDateFns(new Date(report.checkInTime), "EEE")}
                                                    </span>
                                                    <span className="text-lg font-bold">{formatDateFns(new Date(report.checkInTime), "d")}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDateFns(new Date(report.checkInTime), "MMM")}
                                                    </span>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <h4 className="font-medium">{report.client?.firstName}</h4>
                                                        {report.hasSignature && (
                                                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                                                Signed
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        <span>
                                                            {formatDateFns(new Date(report.checkInTime), "HH:mm")} -{" "}
                                                            {report.checkOutTime
                                                                ? formatDateFns(new Date(report.checkOutTime), "HH:mm")
                                                                : "In Progress"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <User className="h-3 w-3 mr-1" />
                                                        <span>{report.caregiver?.firstName}</span>
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

                                                <div className="flex flex-wrap gap-1">
                                                    {report.alerts?.map((alert, index) => (
                                                        <div key={index}>{getAlertBadge(alert.type, alert.severity)}</div>
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
                                                        onClick={() => {
                                                            router.push(`/dashboard/reports/${report.id}`)
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-6">
                            <div className="text-sm text-muted-foreground">Care hours: 12,230h 4m</div>
                            <Button variant="outline" onClick={handleExportReport}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Reports
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="payroll" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left column - Client selection */}
                        <div className="lg:col-span-1">
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <RadioGroup
                                            defaultValue="clients"
                                            value={payrollFilterType}
                                            onValueChange={(value) => setPayrollFilterType(value as "clients" | "careWorkers")}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="clients" id="clients" />
                                                <Label htmlFor="clients">Clients</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="careWorkers" id="careWorkers" />
                                                <Label htmlFor="careWorkers">Care workers</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="search" placeholder={`Search ${payrollFilterType}...`} className="pl-8" />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="showArchived"
                                            checked={showArchivedClients}
                                            onCheckedChange={(checked) => setShowArchivedClients(checked === true)}
                                        />
                                        <Label htmlFor="showArchived">Show archived {payrollFilterType}</Label>
                                    </div>

                                    <div className="border rounded-md">
                                        <div className="flex items-center p-4 border-b">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="selectAll"
                                                    checked={selectedClients.length === payrollData.length && payrollData.length > 0}
                                                    onCheckedChange={selectAllClients}
                                                />
                                                <Label htmlFor="selectAll" className="font-medium">
                                                    Select all
                                                </Label>
                                            </div>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {payrollData.map((client) => (
                                                <div
                                                    key={client.id}
                                                    className="flex items-center p-4 border-b last:border-b-0 hover:bg-accent/50"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`client-${client.id}`}
                                                            checked={selectedClients.includes(client.id)}
                                                            onCheckedChange={() => toggleClientSelection(client.id)}
                                                        />
                                                        <Label htmlFor={`client-${client.id}`}>{client.name}</Label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column - Instructions and data */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create a payroll or invoicing report</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900 font-medium">
                                                1
                                            </div>
                                            <div className="space-y-1">
                                                <p>
                                                    Set up your care worker pay rates and client charge rates on your{" "}
                                                    <a href="#" className="text-gray-900 hover:underline">
                                                        rate sheet page
                                                    </a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900 font-medium">
                                                2
                                            </div>
                                            <div className="space-y-1">
                                                <p>
                                                    Within your{" "}
                                                    <a href="#" className="text-gray-900 hover:underline">
                                                        schedule
                                                    </a>
                                                    , set the correct care worker and client rates on each visit
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-900 font-medium">
                                                3
                                            </div>
                                            <div className="space-y-1">
                                                <p>
                                                    Once you've done 1 and 2, you can now view and download an itemised report showing all
                                                    scheduled visits, care worker events, and their corresponding totals.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h2 className="text-lg font-medium mb-2">Select a date range</h2>
                                                <div className="flex items-center space-x-2">
                                                    <Input type="date" defaultValue="2025-04-01" className="w-[150px]" />
                                                    <span>→</span>
                                                    <Input type="date" defaultValue="2025-04-10" className="w-[150px]" />
                                                </div>
                                            </div>
                                            <Button>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download report
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payroll Table */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle>Payroll Data</CardTitle>
                                        <CardDescription>
                                            {selectedClients.length} {payrollFilterType} selected
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead className="text-right">
                                                            Duration
                                                            <span
                                                                className="ml-1 text-xs text-muted-foreground cursor-help"
                                                                title="Actual duration of care provided"
                                                            >
                                                                ?
                                                            </span>
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Charge
                                                            <span
                                                                className="ml-1 text-xs text-muted-foreground cursor-help"
                                                                title="Actual charge based on care provided"
                                                            >
                                                                ?
                                                            </span>
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Duration
                                                            <span
                                                                className="ml-1 text-xs text-muted-foreground cursor-help"
                                                                title="Scheduled duration of care"
                                                            >
                                                                ?
                                                            </span>
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Charge
                                                            <span
                                                                className="ml-1 text-xs text-muted-foreground cursor-help"
                                                                title="Scheduled charge based on care plan"
                                                            >
                                                                ?
                                                            </span>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {payrollData
                                                        .filter((entry) => selectedClients.includes(entry.id))
                                                        .map((entry) => (
                                                            <TableRow key={entry.id}>
                                                                <TableCell>{entry.name}</TableCell>
                                                                <TableCell className="text-right">{entry.actualDuration}</TableCell>
                                                                <TableCell className="text-right">{entry.actualCharge}</TableCell>
                                                                <TableCell className="text-right">{entry.scheduledDuration}</TableCell>
                                                                <TableCell className="text-right">{entry.scheduledCharge}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    <TableRow className="font-medium">
                                                        <TableCell>Total</TableCell>
                                                        <TableCell className="text-right">{payrollTotals.actualDuration}</TableCell>
                                                        <TableCell className="text-right">£{payrollTotals.actualCharge}</TableCell>
                                                        <TableCell className="text-right">{payrollTotals.scheduledDuration}</TableCell>
                                                        <TableCell className="text-right">£{payrollTotals.scheduledCharge}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="mileage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mileage Reports</CardTitle>
                            <CardDescription>Create a mileage report</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-4">
                                {/* Date Range Selector */}
                                <div className="space-y-2">
                                    <Label>Select a date range</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="date" defaultValue="2025-04-01" className="w-[150px]" placeholder="Start Date" />
                                        <span>→</span>
                                        <Input type="date" defaultValue="2025-04-10" className="w-[150px]" placeholder="End Date" />
                                        <Button variant="ghost" size="icon">
                                            <CalendarIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Care Workers Selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="careWorker">Care workers</Label>
                                    <Select>
                                        <SelectTrigger id="careWorker">
                                            <SelectValue placeholder="Select care workers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {careWorkers?.map((worker) => (
                                                <SelectItem key={worker.id} value={worker.id}>
                                                    {worker.firstName} {worker.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Travel Mode Selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="travelMode">Travel mode</Label>
                                    <Select defaultValue="driving">
                                        <SelectTrigger id="travelMode">
                                            <SelectValue placeholder="Driving" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="driving">Driving</SelectItem>
                                            <SelectItem value="walking">Walking</SelectItem>
                                            <SelectItem value="cycling">Cycling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Download Report Button */}
                                <Button>Download report</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Badge className="bg-gray-100 text-gray-900">1</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Set up your care worker mileage on your{" "}
                                        <a href="#" className="text-gray-900">
                                            rate sheet page
                                        </a>
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge className="bg-gray-100 text-gray-900">2</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Make sure all of your client addresses are correct, including the postcode
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge className="bg-gray-100 text-gray-900">3</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Once you've done 1 and 2, you can now download an itemised report showing all the mileage, and total
                                        amounts owed to care workers, for all travel between clients based on scheduled visits.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* AI Improve Dialog */}
            {selectedReport && (
                <AIImproveDialog report={selectedReport} open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen} />
            )}
        </div>
    )
}
