"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Overview } from "../../components/dashboard/overview"
import { RecentActivity } from "../../components/dashboard/recent-activity"

export default function DashboardPage() {
    return (
        <div className="flex flex-col p-6 w-full max-w-7xl mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="w-full space-y-6">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24</div>
                                <p className="text-xs text-muted-foreground">+2 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Care Workers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">+1 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Office Staff</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">5</div>
                                <p className="text-xs text-muted-foreground">No change from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">7</div>
                                <p className="text-xs text-muted-foreground">+3 from last week</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                        <Card className="lg:col-span-4">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
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
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>View detailed analytics about your care management system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Analytics content will appear here</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reports</CardTitle>
                            <CardDescription>Generate and view reports</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Reports content will appear here</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
