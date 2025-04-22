"use client"


import { useAppSelector } from "../../state/redux"
import { useGetDashboardDataQuery } from "../../state/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import {
    Users,
    Calendar,
    FileText,
    ClipboardList,
    Building2,
    ArrowUpRight,
    Activity,
    CheckCircle2,
    AlertCircle,
    Filter,

    Search,
} from "lucide-react"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

import { Skeleton } from "../../components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function DashboardPage() {
    const { user } = useAppSelector((state) => state.user)
    const [shouldFetch, setShouldFetch] = useState(false)


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

    // Animation variants for staggered animations


    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

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

    // Calculate percentages for progress bars
    const totalEntities =
        dashboardData.stats.totalClients +
        dashboardData.stats.totalCareWorkers +
        dashboardData.stats.totalSchedules +
        dashboardData.stats.totalReports +
        dashboardData.stats.totalMileageRecords +
        dashboardData.stats.totalDocuments

    const getPercentage = (value: number) => {
        return totalEntities > 0 ? Math.round((value / totalEntities) * 100) : 0
    }

    // Get feature status for agency
    const getFeatureStatus = (isEnabled: boolean | undefined) => {
        return isEnabled ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Enabled
            </Badge>
        ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                Disabled
            </Badge>
        )
    }

    const router = useRouter()




    return (
        <div className="p-6 ">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
                <p className="text-neutral-600">Overview of all your detailed of patients and your income</p>
            </div>


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
                            <div className="text-3xl font-bold text-gray-800">{dashboardData.stats.totalClients}</div>
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
                            <div className="text-3xl font-bold text-gray-800">{dashboardData.stats.totalSchedules}</div>
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
                            <h3 className="ml-3 text-sm font-medium text-gray-600">Total Income</h3>
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
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <Button variant="outline" className="bg-white border-gray-200">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" className="bg-white border-gray-200">
                                Export
                            </Button>
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
                            {dashboardData.schedules
                                .filter(schedule => new Date(schedule.date) >= new Date())
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .slice(0, 5)
                                .map((schedule) => (
                                    <tr key={schedule.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{schedule.clientName[0]}</AvatarFallback>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* <Card className="border border-gray-200 shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-gray-700" />
                            <CardTitle className="text-lg font-medium text-gray-800">Admission and Discharge Trends</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-end mb-4 gap-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-sm text-gray-600">Admissions</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                                <span className="text-sm text-gray-600">Discharges</span>
                            </div>
                        </div>
                        <div className="h-[300px] relative">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={admissionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="admissions" stroke="#3B82F6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="discharges" stroke="#6B7280" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-gray-700" />
                            <CardTitle className="text-lg font-medium text-gray-800">Doctor's Schedule</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                                <div className="text-gray-600 text-sm mb-1">Available</div>
                                <div className="text-2xl font-bold text-gray-800">72</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                                <div className="text-gray-600 text-sm mb-1">Unavailable</div>
                                <div className="text-2xl font-bold text-gray-800">24</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                                <div className="text-gray-600 text-sm mb-1">Leave</div>
                                <div className="text-2xl font-bold text-gray-800">16</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">List of Doctor</h4>
                            <div className="space-y-4">
                                {[
                                    { name: "Omar Bergson", specialty: "Anesthesiology", status: "CONFIRMED" },
                                    { name: "Wilson Dias", specialty: "Dermatology", status: "PENDING" },
                                    { name: "Arlene Cooper", specialty: "General Surgery", status: "CONFIRMED" },
                                ].map((doctor, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 border border-gray-200">
                                                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={doctor.name} />
                                                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-3">
                                                <h5 className="font-medium text-gray-800">{doctor.name}</h5>
                                                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                            </div>
                                        </div>
                                        <div>{getScheduleStatusBadge(doctor.status)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="border border-gray-200 shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-gray-700" />
                                <CardTitle className="text-lg font-medium text-gray-800">Agency Information</CardTitle>
                            </div>
                            <Badge
                                variant={dashboardData.user.agency.isActive ? "default" : "destructive"}
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0"
                            >
                                {dashboardData.user.agency.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <CardDescription className="text-gray-600 mt-1">
                            Details about your care agency and enabled features
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="mb-4 bg-gray-100">
                                <TabsTrigger value="details" className="data-[state=active]:bg-white">
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="features" className="data-[state=active]:bg-white">
                                    Features
                                </TabsTrigger>
                                <TabsTrigger value="billing" className="data-[state=active]:bg-white">
                                    Billing
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="details">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Agency Name</h3>
                                            <p className="text-lg font-medium text-gray-800">{dashboardData.user.agency.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                                            <p className="text-base text-gray-800">
                                                {dashboardData.user.agency.createdAt ? new Date(dashboardData.user.agency.createdAt).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Account Type</h3>
                                            <p className="text-base text-gray-800">
                                                {dashboardData.user.agency.isTestAccount ? "Test Account" : "Production Account"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                                            <p className="text-base text-gray-800">
                                                {dashboardData.user.agency.address || "123 Main Street, Suite 101"}
                                            </p>
                                            <p className="text-base text-gray-800">
                                                {dashboardData.user.agency.city || "San Francisco"}, {dashboardData.user.agency.state || "CA"}{" "}
                                                {dashboardData.user.agency.zipCode || "94105"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                                            <p className="text-base text-gray-800">{dashboardData.user.agency.phone || "(555) 123-4567"}</p>
                                            <p className="text-base text-gray-800">
                                                {dashboardData.user.agency.email || "contact@careagency.com"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="features">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">Schedule V2</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasScheduleV2)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">EMAR</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasEMAR)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">Finance</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasFinance)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">Policies & Procedures</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasPoliciesAndProcedures)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">Week 1/2 Schedule</span>
                                            {getFeatureStatus(dashboardData.user.agency.isWeek1And2ScheduleEnabled)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">Advanced Reporting</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasAdvancedReporting)}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-2 bg-white border-gray-200">
                                        Request Feature Access
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="billing">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Current Plan</h3>
                                            <p className="text-sm text-gray-600">Professional Plan</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Next Billing Date</h3>
                                            <p className="text-sm text-gray-600">May 15, 2025</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="bg-white border-gray-200">
                                            View Invoice
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Payment Method</h3>
                                            <p className="text-sm text-gray-600">Visa ending in 4242</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="bg-white border-gray-200">
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <div className="flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-gray-700" />
                            <CardTitle className="text-lg font-medium text-gray-800">Stats Breakdown</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Clients</span>
                                    <span className="text-blue-600 text-sm">+5% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalClients}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalClients)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalClients)} className="h-1 bg-gray-100" />
                            </div>

                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Care Workers</span>
                                    <span className="text-blue-600 text-sm">+2% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalCareWorkers}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalCareWorkers)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalCareWorkers)} className="h-1 bg-gray-100" />
                            </div>

                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Schedules</span>
                                    <span className="text-blue-600 text-sm">+12% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalSchedules}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalSchedules)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalSchedules)} className="h-1 bg-gray-100" />
                            </div>

                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Reports</span>
                                    <span className="text-blue-600 text-sm">+8% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalReports}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalReports)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalReports)} className="h-1 bg-gray-100" />
                            </div>

                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Mileage Records</span>
                                    <span className="text-blue-600 text-sm">+3% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalMileageRecords}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalMileageRecords)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalMileageRecords)} className="h-1 bg-gray-100" />
                            </div>

                            <div className="p-3 border border-gray-200 rounded-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Documents</span>
                                    <span className="text-blue-600 text-sm">+7% from last month</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">{dashboardData.stats.totalDocuments}</span>
                                    <span className="text-sm text-gray-600">
                                        {getPercentage(dashboardData.stats.totalDocuments)}% of total
                                    </span>
                                </div>
                                <Progress value={getPercentage(dashboardData.stats.totalDocuments)} className="h-1 bg-gray-100" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    )
}

