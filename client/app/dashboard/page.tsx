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
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-2 rounded-md bg-gray-100">
                                <Users className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-gray-600">Total Clients</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-gray-800">{dashboardData?.stats.totalClients}</div>
                            <div className="flex items-center text-blue-600 text-sm">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +12%
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Patient increase in 7 days.</div>
                        <div className="flex justify-end mt-2" onClick={() => router.push("/dashboard/users")}>
                            <Button variant="link" className="text-gray-600 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-2 rounded-md bg-gray-100">
                                <Calendar className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-gray-600">Total Appointment</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-gray-800">{dashboardData?.stats.totalSchedules}</div>
                            <div className="flex items-center text-blue-600 text-sm">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +10%
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Appointment increase in 7 days.</div>
                        <div className="flex justify-end mt-2" onClick={() => router.push("/dashboard/schedule")}>
                            <Button variant="link" className="text-gray-600 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-2 rounded-md bg-gray-100">
                                <FileText className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-gray-600">Total Revenue</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-gray-800">$7,209.29</div>
                            <div className="flex items-center text-blue-600 text-sm">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +24%
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Treatments increase in 7 days.</div>
                        <div className="flex justify-end mt-2">
                            <Button variant="link" className="text-gray-600 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <div className="p-2 rounded-md bg-gray-100">
                                <ClipboardList className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="ml-3 text-sm font-medium text-gray-600">Total Treatments</h3>
                        </div>
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="text-3xl font-bold text-gray-800">234</div>
                            <div className="flex items-center text-blue-600 text-sm">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +11%
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">Income increase in 7 days.</div>
                        <div className="flex justify-end mt-2">
                            <Button variant="link" className="text-gray-600 p-0 h-auto">
                                See details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-gray-200 shadow-sm mb-6">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ClipboardList className="h-5 w-5 mr-2 text-gray-700" />
                            <CardTitle className="text-lg font-medium text-gray-800">Upcoming Appointments</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                                    className="bg-white border-gray-200"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                {showFilters && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <select
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                <select
                                                    className="w-full border border-gray-200 rounded-md p-2 text-sm"
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
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Care Worker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={getRandomPlaceholderImage()} alt={schedule.clientName} />
                                                <AvatarFallback>
                                                    {schedule.clientName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {schedule.clientName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" className={`${schedule.type === "APPOINTMENT"
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : schedule.type === "WEEKLY_CHECKUP"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}>
                                            {schedule.type.replace("_", " ")}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{new Date(schedule.date).toLocaleDateString()}</div>
                                        <div className="text-sm text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {schedule.careWorkerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="outline" className={`${schedule.status === "CONFIRMED"
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : schedule.status === "PENDING"
                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                : "bg-red-50 text-red-700 border-red-200"
                                            }`}>
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
