"use client"


import { useAppDispatch, useAppSelector } from "@/state/redux"
import { useGetAgencyByIdQuery, useGetDashboardDataQuery } from "@/state/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Users,
    Calendar,
    FileText,

    ArrowUpRight,

    AlertCircle,
    Filter,

    Search,
    Timer,
    Bell,
    Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CustomInput } from "@/components/ui/custom-input"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import { CustomSelect } from "@/components/ui/custom-select"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Alert, Report } from "@/types/prismaTypes"
import { setActiveUserType } from "@/state/slices/userSlice"
import { setSidebarMode } from "@/state/slices/reportSlice"

export default function DashboardPage() {
    const { user } = useAppSelector((state) => state.user)
    const [shouldFetch, setShouldFetch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const careWorkers = useAppSelector((state) => state.user.careWorkers)
    const { data: agencyData } = useGetAgencyByIdQuery(user?.userInfo?.agencyId || "")
    const reports: Report[] = agencyData?.reports || []
    const alerts: Alert[] = agencyData?.alerts || []
    const unresolvedAlerts = alerts.filter(alert => alert.status !== "RESOLVED")
    const dispatch = useAppDispatch()


    const getStatusColor = (status: string) => {
        if (status === "CONFIRMED") return "bg-green-100 text-green-800 border-green-200"
        if (status === "PENDING") return "bg-yellow-100 text-yellow-800 border-yellow-200"
        if (status === "CANCELLED") return "bg-red-100 text-red-800 border-red-200"
        if (status === "COMPLETED") return "bg-green-200 text-green-900 border-green-300"
        return "bg-gray-100 text-gray-800 border-gray-200"
    }

    const formatAlertType = (type: string) => {
        return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    useEffect(() => {
        if (user?.userInfo?.id) {
            setShouldFetch(true)
        }
    }, [user?.userInfo?.id])

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        error,
    } = useGetDashboardDataQuery(user?.userInfo?.id || "", {
        skip: !shouldFetch,
    })
    console.log("DASHBOARD DATA", dashboardData)



    const isLoading = !shouldFetch || isDashboardLoading

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-2 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <ErrorDisplay
                    error={error}
                    title="Dashboard Error"
                    className="mb-4"
                />
                <div className="flex justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        )
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-amber-100 p-3">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>
                        <CardTitle className="text-center">No Data Available</CardTitle>
                        <CardDescription className="text-center">
                            We couldn&apos;t find any dashboard data for your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            Please make sure you&apos;re logged in with the correct account or contact support for assistance.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const router = useRouter()

    const filteredSchedules = dashboardData?.schedules
        .filter(schedule => new Date(schedule.date) >= new Date())
        .filter(schedule => {
            const matchesSearch = schedule.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.careWorkerName.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = !selectedStatus || selectedStatus === "all" || schedule.status === selectedStatus
            const matchesType = !selectedType || selectedType === "all" || schedule.type === selectedType
            return matchesSearch && matchesStatus && matchesType
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    return (
        <div className="p-6 space-y-4 mt-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-full bg-blue-100", "dark:bg-blue-900/30")}>
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Active Clients</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalClients}</div>
                        </div>

                        <div className="flex justify-start mt-1" onClick={() => {
                            dispatch(setActiveUserType("CLIENT"))
                            router.push("/dashboard/users")
                        }}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-[11px]">
                                <Info className="h-2.5 w-2.5 " />
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-full", getStatusColor("active"))}>
                                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Active Care Workers</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{careWorkers.length}</div>
                        </div>

                        <div className="flex justify-start mt-1" onClick={() => {
                            dispatch(setActiveUserType("CARE_WORKER"))
                            router.push("/dashboard/users")

                        }}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-[11px]">
                                <Info className="h-2.5 w-2.5" />
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-full bg-purple-100", "dark:bg-purple-900/30")}>
                                <Timer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Hours</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalSchedules}</div>
                        </div>

                        <div className="flex justify-start mt-1" onClick={() => router.push("/dashboard/schedule")}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-[11px]">
                                <Info className="h-2.5 w-2.5 " />
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-full bg-green-100", "dark:bg-green-900/30")}>
                                <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Revenue</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">${dashboardData?.stats.totalRevenue.toFixed(2)}</div>
                        </div>

                        <div className="flex justify-start mt-1">
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-[11px]" onClick={() => router.push("/dashboard/billing")}>
                                <Info className="h-2.5 w-2.5 " />
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-full bg-amber-100", "dark:bg-amber-900/30")}>
                                <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Unresolved Alerts</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{unresolvedAlerts.length}</div>
                        </div>

                        <div className="flex justify-start mt-1" onClick={() => {
                            dispatch(setSidebarMode("alerts"))
                            router.push("/dashboard/reports")
                        }}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-[11px]">
                                <Info className="h-2.5 w-2.5" />
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>


            </div>



            {/* Recent Schedules */}
            <Card className="w-full overflow-hidden">
                <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center">
                            <div className={cn("p-1.5 rounded-full bg-indigo-100", "dark:bg-indigo-900/30")}>
                                <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="text-base ml-2">Upcoming Schedules</CardTitle>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <CustomInput
                                placeholder="Search schedules..."
                                value={searchQuery}
                                onChange={(value: string) => setSearchQuery(value)}
                                icon={<Search className="h-3.5 w-3.5" />}
                                className="w-full sm:w-[200px] h-8"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-8 w-full sm:w-auto"
                            >
                                <Filter className="h-3.5 w-3.5 .5" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {showFilters && (
                    <CardContent className="p-4 pt-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <CustomSelect
                                value={selectedStatus || "all"}
                                onChange={setSelectedStatus}
                                options={[
                                    { value: "all", label: "All Status" },
                                    { value: "completed", label: "Completed" },
                                    { value: "pending", label: "Pending" },
                                    { value: "cancelled", label: "Cancelled" }
                                ]}
                                placeholder="Select Status"
                                selectSize="sm"
                            />

                            <CustomSelect
                                value={selectedType || "all"}
                                onChange={setSelectedType}
                                options={[
                                    { value: "all", label: "All Types" },
                                    { value: "visit", label: "Visit" },
                                    { value: "appointment", label: "Appointment" },
                                    { value: "task", label: "Task" }
                                ]}
                                placeholder="Select Type"
                                selectSize="sm"
                            />
                        </div>
                    </CardContent>
                )}

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {filteredSchedules.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Care Worker</th>
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="py-2 px-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedules.map((schedule) => (
                                        <tr key={schedule.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                            <td className="py-2 px-3">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={getRandomPlaceholderImage()} />
                                                        <AvatarFallback>{schedule.clientName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{schedule.clientName}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-sm text-muted-foreground">{schedule.careWorkerName}</td>
                                            <td className="py-2 px-3 text-sm text-muted-foreground">
                                                {new Date(schedule.date).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-2 px-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[11px]",
                                                        getStatusColor(schedule.status.toUpperCase())
                                                    )}
                                                >
                                                    {schedule.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                                <Button variant="outline" size="sm" className="h-7" onClick={() => router.push(`/dashboard/schedule`)}>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-2" />
                                                        View
                                                    </span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-muted rounded-md">
                                    <Calendar className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-medium mb-1">
                                    {searchQuery ? "No schedules match your search" : "No upcoming schedules"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery
                                        ? "Try adjusting your search parameters"
                                        : "Schedules will appear here once they are created"}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* Alerts and Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Unresolved Alerts Card */}
                <Card className="w-full overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center">
                                <div className={cn("p-1.5 rounded-full bg-red-100", "dark:bg-red-900/30")}>
                                    <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                </div>
                                <CardTitle className="text-base ml-2">Unresolved Alerts</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[11px] bg-red-50 text-red-600 border-red-200">
                                {unresolvedAlerts.length} Alerts
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Alert</th>
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="py-2 px-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unresolvedAlerts.length > 0 ? (
                                        unresolvedAlerts.map((alert) => (
                                            <tr key={alert.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200 h-[72px]">
                                                <td className="py-2 px-3">
                                                    <div className="flex items-start space-x-2">
                                                        <div>
                                                            <p className="text-sm font-medium">{formatAlertType(alert.type)}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Client: {alert.client?.fullName || 'Unknown'} • Care Worker: {alert.careworker?.fullName || 'Unknown'}
                                                            </p>
                                                            {alert.description && (
                                                                <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 text-sm text-muted-foreground">
                                                    {new Date(alert.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-2 px-3 text-right">
                                                    <Button variant="outline" size="sm" className="h-7">
                                                        <span className="flex items-center">
                                                            <AlertCircle className="h-3 w-3 mr-2" />
                                                            View
                                                        </span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center">
                                                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-muted rounded-md">
                                                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-base font-medium mb-1">No Unresolved Alerts</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    All alerts have been resolved
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Flagged Reports Card */}
                <Card className="w-full overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center">
                                <div className={cn("p-1.5 rounded-full bg-amber-100", "dark:bg-amber-900/30")}>
                                    <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <CardTitle className="text-base ml-2">Flagged Reports</CardTitle>
                            </div>
                            <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-600 border-amber-200">
                                {reports?.filter(report => report.status === "FLAGGED").length || 0} Pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Report</th>
                                        <th className="py-2 px-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="py-2 px-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports?.filter(report => report.status === "FLAGGED").map((report: Report) => (
                                        <tr key={report.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200 h-[72px]">
                                            <td className="py-2 px-3">
                                                <div className="flex items-start space-x-2">
                                                    <div>
                                                        <p className="text-sm font-medium">{report.title || "Untitled Report"}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Client: {report.client?.fullName || 'Unknown'} • Care Worker: {report.caregiver?.fullName || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-sm text-muted-foreground">
                                                {new Date(report.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7"
                                                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                                                >
                                                    <span className="flex items-center">
                                                        <FileText className="h-3 w-3 mr-2" />
                                                        View
                                                    </span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
