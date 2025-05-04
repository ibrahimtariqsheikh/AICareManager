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
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
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
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-center">Error Loading Dashboard</CardTitle>
                        <CardDescription className="text-center">
                            We encountered a problem while loading your dashboard data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error ? JSON.stringify(error) : null}
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded-md transition-colors"
                        >
                            Refresh Page
                        </button>
                    </CardContent>
                </Card>
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
        <div className="px-6 py-2 space-y-6 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className={cn("p-2 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <Users className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Clients</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalClients}</div>
                            <div className="flex items-center text-blue-600 text-sm dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +12%
                            </div>
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">Patient increase in 7 days.</div>
                        <div className="flex justify-end mt-2" onClick={() => router.push("/dashboard/users")}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className={cn("p-2 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <Calendar className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Appointment</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-neutral-800 dark:text-white">{dashboardData?.stats.totalSchedules}</div>
                            <div className="flex items-center text-blue-600 text-sm dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +10%
                            </div>
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">Appointment increase in 7 days.</div>
                        <div className="flex justify-end mt-2" onClick={() => router.push("/dashboard/schedule")}>
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className={cn("p-2 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <FileText className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Revenue</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-neutral-800 dark:text-white">$7,209.29</div>
                            <div className="flex items-center text-blue-600 text-sm dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +24%
                            </div>
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">Treatments increase in 7 days.</div>
                        <div className="flex justify-end mt-2">
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className={cn("p-2 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                                <ClipboardList className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Treatments</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-neutral-800 dark:text-white">234</div>
                            <div className="flex items-center text-blue-600 text-sm dark:text-blue-400">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +11%
                            </div>
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">Income increase in 7 days.</div>
                        <div className="flex justify-end mt-2">
                            <Button variant="link" className="text-neutral-600 dark:text-neutral-300 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className={cn("border border-neutral-200 shadow-sm mb-6", "dark:border-neutral-800 dark:bg-card")}>
                <CardHeader className={cn("border-b border-neutral-100 pb-4", "dark:border-neutral-800")}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ClipboardList className="h-4 w-4 mr-2 text-neutral-700 dark:text-neutral-300" />
                            <CardTitle className="text-lg font-medium text-neutral-800 dark:text-white">Upcoming Appointments</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                                <CustomInput
                                    placeholder="Search appointments..."
                                    className='w-[200px]'
                                    value={searchQuery}
                                    onChange={(value: string) => setSearchQuery(value)}
                                />
                            </div>
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className={cn("bg-white border-neutral-200", "dark:bg-neutral-800 dark:border-neutral-700")}
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                {showFilters && (
                                    <div className={cn("absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-neutral-200 p-4", "dark:bg-neutral-800 dark:border-neutral-700")}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                                                <select
                                                    className={cn("w-full border border-neutral-200 rounded-md p-2 text-sm", "dark:bg-neutral-800 dark:border-neutral-700 dark:text-white")}
                                                    value={selectedStatus || ""}
                                                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                                                >
                                                    <option value="">All Statuses</option>
                                                    <option value="CONFIRMED">Confirmed</option>
                                                    <option value="PENDING">Pending</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Type</label>
                                                <select
                                                    className={cn("w-full border border-neutral-200 rounded-md p-2 text-sm", "dark:bg-neutral-800 dark:border-neutral-700 dark:text-white")}
                                                    value={selectedType || ""}
                                                    onChange={(e) => setSelectedType(e.target.value || null)}
                                                >
                                                    <option value="">All Types</option>
                                                    <option value="APPOINTMENT">Appointment</option>
                                                    <option value="WEEKLY_CHECKUP">Weekly Checkup</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className={cn("border-b border-neutral-100", "dark:border-neutral-800")}>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Appointment Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Care Worker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className={cn("bg-white divide-y divide-neutral-100", "dark:bg-neutral-900 dark:divide-neutral-800")}>
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule.id} className={cn("hover:bg-neutral-50", "dark:hover:bg-neutral-800/50")}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={getRandomPlaceholderImage()} alt={schedule.clientName} />
                                                <AvatarFallback>
                                                    {schedule.clientName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {schedule.clientName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" className={cn(
                                            schedule.type === "APPOINTMENT"
                                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                : schedule.type === "WEEKLY_CHECKUP"
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                        )}>
                                            {schedule.type.replace("_", " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900 dark:text-white">{new Date(schedule.date).toLocaleDateString()}</div>
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{schedule.startTime} - {schedule.endTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900 dark:text-white">
                                            {schedule.careWorkerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" className={cn(
                                            schedule.status === "CONFIRMED"
                                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                                : schedule.status === "PENDING"
                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                        )}>
                                            {schedule.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}
