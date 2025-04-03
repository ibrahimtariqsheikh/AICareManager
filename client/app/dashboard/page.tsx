"use client"

import { useState } from "react"
import { useAppSelector } from "../../state/redux"
import { useGetDashboardDataQuery } from "../../state/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import {
    Users,
    Calendar,
    FileText,
    Car,
    UserCheck,
    ClipboardList,
    Building2,
    ArrowUpRight,
    Activity,
    CheckCircle2,
    AlertCircle,
    Filter,
    ChevronRight,
    MoreHorizontal,
    CalendarClock,
    Bell,
} from "lucide-react"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "../../components/ui/skeleton"

export default function DashboardPage() {
    const { user } = useAppSelector((state) => state.user)
    const [scheduleFilter, setScheduleFilter] = useState("all")

    const {
        data: dashboardData,
        isLoading,
        error,
    } = useGetDashboardDataQuery(user?.userInfo?.id || "", {
        skip: !user?.userInfo?.id,
    })

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
    }

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
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
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors"
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
                            We couldn't find any dashboard data for your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            Please make sure you're logged in with the correct account or contact support for assistance.
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

    const stats = [
        {
            title: "Clients",
            value: dashboardData.stats.totalClients,
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-100",
            percentage: getPercentage(dashboardData.stats.totalClients),
            progressColor: "bg-blue-500",
            trend: "+5% from last month",
        },
        {
            title: "Care Workers",
            value: dashboardData.stats.totalCareWorkers,
            icon: UserCheck,
            color: "text-green-500",
            bgColor: "bg-green-100",
            percentage: getPercentage(dashboardData.stats.totalCareWorkers),
            progressColor: "bg-green-500",
            trend: "+2% from last month",
        },
        {
            title: "Schedules",
            value: dashboardData.stats.totalSchedules,
            icon: Calendar,
            color: "text-purple-500",
            bgColor: "bg-purple-100",
            percentage: getPercentage(dashboardData.stats.totalSchedules),
            progressColor: "bg-purple-500",
            trend: "+12% from last month",
        },
        {
            title: "Reports",
            value: dashboardData.stats.totalReports,
            icon: FileText,
            color: "text-orange-500",
            bgColor: "bg-orange-100",
            percentage: getPercentage(dashboardData.stats.totalReports),
            progressColor: "bg-orange-500",
            trend: "+8% from last month",
        },
        {
            title: "Mileage Records",
            value: dashboardData.stats.totalMileageRecords,
            icon: Car,
            color: "text-red-500",
            bgColor: "bg-red-100",
            percentage: getPercentage(dashboardData.stats.totalMileageRecords),
            progressColor: "bg-red-500",
            trend: "+3% from last month",
        },
        {
            title: "Documents",
            value: dashboardData.stats.totalDocuments,
            icon: ClipboardList,
            color: "text-yellow-500",
            bgColor: "bg-yellow-100",
            percentage: getPercentage(dashboardData.stats.totalDocuments),
            progressColor: "bg-yellow-500",
            trend: "+7% from last month",
        },
    ]

    // Get feature status for agency
    const getFeatureStatus = (isEnabled: boolean | undefined) => {
        return isEnabled ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Enabled
            </Badge>
        ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                Disabled
            </Badge>
        )
    }

    // Filter schedules based on selected filter
    const filteredSchedules = dashboardData.schedules.filter((schedule) => {
        if (scheduleFilter === "all") return true;
        if (scheduleFilter === "today") {
            const today = new Date();
            const scheduleDate = new Date(schedule.date);
            return (
                scheduleDate.getDate() === today.getDate() &&
                scheduleDate.getMonth() === today.getMonth() &&
                scheduleDate.getFullYear() === today.getFullYear()
            );
        }
        if (scheduleFilter === "tomorrow") {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const scheduleDate = new Date(schedule.date);
            return (
                scheduleDate.getDate() === tomorrow.getDate() &&
                scheduleDate.getMonth() === tomorrow.getMonth() &&
                scheduleDate.getFullYear() === tomorrow.getFullYear()
            );
        }
        if (scheduleFilter === "pending") {
            return schedule.status === "PENDING";
        }
        return true;
    });

    // Function to get schedule type badge
    const getScheduleTypeBadge = (type: string) => {
        switch (type) {
            case "HOME_VISIT":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Home Visit</Badge>;
            case "MEDICATION":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">Medication</Badge>;
            case "THERAPY":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">Therapy</Badge>;
            case "APPOINTMENT":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-0">Appointment</Badge>;
            case "SHOPPING":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0">Shopping</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0">{type}</Badge>;
        }
    };

    // Function to get schedule status badge
    const getScheduleStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Confirmed
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                    </Badge>
                );
            case "CANCELED":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Canceled
                    </Badge>
                );
            case "COMPLETED":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Completed
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Function to format date in a user-friendly way
    const formatScheduleDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        ) {
            return "Today";
        } else if (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        ) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl font-bold">Welcome, {dashboardData.user.firstName}!</h1>
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                                {dashboardData.user.role}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">Here's an overview of your agency's activities and statistics</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="relative">
                                        <Bell className="h-4 w-4" />
                                        {dashboardData.notifications.length > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                                {dashboardData.notifications.length}
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {dashboardData.notifications.length > 0 ? (
                                        <div className="space-y-2">
                                            {dashboardData.notifications.map((notification) => (
                                                <div key={notification.id} className="flex items-start space-x-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{notification.title}</p>
                                                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(notification.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No new notifications</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button>
                            <CalendarClock className="h-4 w-4 mr-2" />
                            New Schedule
                        </Button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                {stats.map((stat) => (
                    <motion.div key={stat.title} variants={itemVariants}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline space-x-2 mb-1">
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.percentage}% of total</div>
                                </div>
                                <div className="text-xs text-green-600 mb-2">{stat.trend}</div>
                                <Progress value={stat.percentage} className={`h-1 ${stat.progressColor}`} />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
            >
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                                    Upcoming Schedules
                                </CardTitle>
                                <CardDescription>View and manage your upcoming appointments and schedules</CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8">
                                            <Filter className="h-3.5 w-3.5 mr-1" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setScheduleFilter("all")}>All Schedules</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setScheduleFilter("today")}>Today Only</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setScheduleFilter("tomorrow")}>Tomorrow Only</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setScheduleFilter("pending")}>Pending Approval</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence>
                            {filteredSchedules.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-8"
                                >
                                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                    <h3 className="text-lg font-medium mb-1">No Upcoming Schedules</h3>
                                    <p className="text-muted-foreground">There are no schedules matching your current filter.</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSchedules.map((schedule, index) => (
                                        <motion.div
                                            key={schedule.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="text-center">
                                                    <div className="text-sm font-medium">{formatScheduleDate(schedule.date)}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {schedule.startTime} - {schedule.endTime}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center mb-1">
                                                    <h4 className="font-medium">{schedule.title}</h4>
                                                    <div className="ml-2">{getScheduleTypeBadge(schedule.type)}</div>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <div className="flex items-center mr-4">
                                                        <Avatar className="h-5 w-5 mr-1">
                                                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={schedule.clientName} />
                                                            <AvatarFallback>{schedule.clientName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>Client: {schedule.clientName}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Avatar className="h-5 w-5 mr-1">
                                                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={schedule.careWorkerName} />
                                                            <AvatarFallback>{schedule.careWorkerName.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>Care Worker: {schedule.careWorkerName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                                                {getScheduleStatusBadge(schedule.status)}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                                                        <DropdownMenuItem>Cancel Schedule</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredSchedules.length} of {dashboardData.schedules.length} schedules
                        </p>
                        <Button variant="outline" size="sm" onClick={() => (window.location.href = "/schedule")}>
                            View All Schedules
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center">
                                <Building2 className="h-5 w-5 mr-2 text-primary" />
                                Agency Information
                            </CardTitle>
                            <Badge variant={dashboardData.user.agency.isActive ? "default" : "destructive"}>
                                {dashboardData.user.agency.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <CardDescription>Details about your care agency and enabled features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="billing">Billing</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Agency Name</h3>
                                            <p className="text-lg font-medium">{dashboardData.user.agency.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                                            <p className="text-base">{new Date(dashboardData.user.agency.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h3>
                                            <p className="text-base">
                                                {dashboardData.user.agency.isTestAccount ? "Test Account" : "Production Account"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                                            <p className="text-base">{dashboardData.user.agency.address || "123 Main Street, Suite 101"}</p>
                                            <p className="text-base">
                                                {dashboardData.user.agency.city || "San Francisco"}, {dashboardData.user.agency.state || "CA"} {dashboardData.user.agency.zipCode || "94105"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                                            <p className="text-base">{dashboardData.user.agency.phone || "(555) 123-4567"}</p>
                                            <p className="text-base">{dashboardData.user.agency.email || "contact@careagency.com"}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="features">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>Schedule V2</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasScheduleV2)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>EMAR</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasEMAR)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>Finance</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasFinance)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>Policies & Procedures</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasPoliciesAndProcedures)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>Week 1/2 Schedule</span>
                                            {getFeatureStatus(dashboardData.user.agency.isWeek1And2ScheduleEnabled)}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                            <span>Advanced Reporting</span>
                                            {getFeatureStatus(dashboardData.user.agency.hasAdvancedReporting)}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="mt-2">
                                        Request Feature Access
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="billing">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <h3 className="font-medium">Current Plan</h3>
                                            <p className="text-sm text-muted-foreground">Professional Plan</p>
                                        </div>
                                        <Badge>Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <h3 className="font-medium">Next Billing Date</h3>
                                            <p className="text-sm text-muted-foreground">May 15, 2023</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View Invoice
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <h3 className="font-medium">Payment Method</h3>
                                            <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-primary" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { title: "Schedule Appointment", icon: Calendar, href: "/schedule" },
                            { title: "Add New Client", icon: Users, href: "/clients/new" },
                            { title: "Create Report", icon: FileText, href: "/reports/new" },
                            { title: "Upload Document", icon: ClipboardList, href: "/documents/upload" },
                        ].map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => (window.location.href = action.href)}
                                className="flex items-center justify-between w-full p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                                        <action.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{action.title}</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                            </motion.button>
                        ))}
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/settings")}>
                            View All Actions
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

