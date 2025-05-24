"use client"


import { useAppSelector } from "../../state/redux"
import { useGetDashboardDataQuery } from "../../state/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import {
    Users,
    Calendar,
    FileText,
    ClipboardList,
    ArrowUpRight,

    AlertCircle,
    Filter,

    Search,
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

import { Skeleton } from "../../components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { CustomInput } from "@/components/ui/custom-input"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ErrorDisplay } from "@/components/ui/error-display"


export default function DashboardPage() {
    const { user } = useAppSelector((state) => state.user)
    const [shouldFetch, setShouldFetch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)

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
            const matchesStatus = !selectedStatus || schedule.status === selectedStatus
            const matchesType = !selectedType || schedule.type === selectedType
            return matchesSearch && matchesStatus && matchesType
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    return (
        <div className="p-6 space-y-4 mt-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <Users className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Clients</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalClients}</div>
                            <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                +12%
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Patient increase in 7 days.</div>
                        <div className="flex justify-end mt-1" onClick={() => router.push("/dashboard/users")}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-xs">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <Calendar className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Appointment</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalSchedules}</div>
                            <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                +10%
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Appointment increase in 7 days.</div>
                        <div className="flex justify-end mt-1" onClick={() => router.push("/dashboard/schedule")}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-xs">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <FileText className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Revenue</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">$7,209.29</div>
                            <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                +24%
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Treatments increase in 7 days.</div>
                        <div className="flex justify-end mt-1">
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-xs">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                            <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <ClipboardList className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Treatments</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <div className="text-2xl font-bold text-neutral-800 dark:text-white">234</div>
                            <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                +11%
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">Treatments increase in 7 days.</div>
                        <div className="flex justify-end mt-1">
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto text-xs">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Schedules */}
            <Card>
                <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Recent Schedules</CardTitle>
                        <div className="flex items-center space-x-2">
                            <CustomInput
                                placeholder="Search schedules..."
                                value={searchQuery}
                                onChange={(value: string) => setSearchQuery(value)}
                                icon={<Search className="h-3.5 w-3.5" />}
                                className="w-[200px] h-8"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-8"
                            >
                                <Filter className="h-3.5 w-3.5 mr-1.5" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {showFilters && (
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center space-x-3">
                            <Select value={selectedStatus || ""} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[150px] h-8 text-sm">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedType || ""} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[150px] h-8 text-sm">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Types</SelectItem>
                                    <SelectItem value="visit">Visit</SelectItem>
                                    <SelectItem value="appointment">Appointment</SelectItem>
                                    <SelectItem value="task">Task</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                )}

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        {filteredSchedules.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Care Worker</th>
                                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
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
                                                {new Date(schedule.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        schedule.status === "completed" && "bg-green-100 text-green-800 border-green-200",
                                                        schedule.status === "pending" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                                                        schedule.status === "cancelled" && "bg-red-100 text-red-800 border-red-200"
                                                    )}
                                                >
                                                    {schedule.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-3 text-right">
                                                <Button variant="outline" size="sm" className="h-7">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3.5 w-3.5 mr-1" />
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
        </div>
    )
}
