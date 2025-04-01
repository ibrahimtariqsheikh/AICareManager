"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Overview } from "../../components/dashboard/overview"
import { RecentActivity } from "../../components/dashboard/recent-activity"
import { useState } from "react"
import { Search, Filter, Bell, Plus, CalendarIcon, MoreHorizontal, Download, Settings, ChevronRight, Users, FileText, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { UpcomingAppointments } from "../../components/dashboard/upcoming-appointments"
import { DailySchedule } from "../../components/dashboard/daily-schedule"
import { ClientStats } from "../../components/dashboard/client-stats"
import { ActivityMetrics } from "../../components/dashboard/activity-metrics"
import { Calendar } from "../../components/ui/calender"

export default function DashboardPage() {
    const [date, setDate] = useState<Date>(new Date())

    return (
        <div className="flex flex-col p-6 w-full max-w-7xl mx-auto min-h-screen">
            {/* Header with search and actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Welcome back to your care management dashboard</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-9 h-9 w-full sm:w-[200px] lg:w-[280px]" />
                    </div>

                    <Button size="sm" variant="outline" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>

                    <Button size="sm" className="hidden sm:flex">
                        <Plus className="mr-2 h-4 w-4" />
                        New Client
                    </Button>

                    <Button size="icon" variant="ghost" className="relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="/placeholder.svg" alt="User" />
                                    <AvatarFallback>TL</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main content */}
            <Tabs defaultValue="overview" className="w-full space-y-6">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">212</div>
                                <p className="text-xs text-muted-foreground">+8 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Care Reports</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">114</div>
                                <p className="text-xs text-muted-foreground">+24 from last week</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">182</div>
                                <p className="text-xs text-muted-foreground">+12 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">7</div>
                                <p className="text-xs text-muted-foreground">+3 from last week</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                        <Card className="lg:col-span-4">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Overview</CardTitle>
                                    <CardDescription>Care delivery metrics for the current month</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Report
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pl-2 overflow-x-auto">
                                <Overview />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Recent user activity and invitations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentActivity />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Appointments and Calendar */}
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                        <Card className="lg:col-span-4">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Upcoming Appointments</CardTitle>
                                    <CardDescription>Your scheduled appointments for the next 7 days</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="h-8">
                                    View All
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <UpcomingAppointments />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Calendar</CardTitle>
                                <CardDescription>Your monthly schedule at a glance</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(date) => date && setDate(date)}
                                    className="rounded-md border"
                                />
                                <div className="mt-4 space-y-1">
                                    <p className="text-sm font-medium">Selected: {date.toDateString()}</p>
                                    <p className="text-sm text-muted-foreground">3 appointments scheduled</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daily Schedule</CardTitle>
                                <CardDescription>Manage your appointments and care visits</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Month
                                </Button>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Appointment
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DailySchedule />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Clients Tab */}
                <TabsContent value="clients" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Management</CardTitle>
                            <CardDescription>View and manage your client information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ClientStats />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Metrics</CardTitle>
                            <CardDescription>Performance and care delivery metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ActivityMetrics />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

