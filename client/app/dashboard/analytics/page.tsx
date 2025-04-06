"use client"

import { useGetDashboardDataQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, Users, DollarSign, Activity } from "lucide-react"

export default function AnalyticsPage() {
    const { user } = useAppSelector((state) => state.user)
    const { data: dashboardData, isLoading } = useGetDashboardDataQuery(user?.userInfo?.id || "", {
        skip: !user?.userInfo?.id,
    })

    if (isLoading) {
        return (
            <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-40 bg-muted rounded animate-pulse mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full bg-muted rounded animate-pulse" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full bg-muted rounded animate-pulse" />
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Skeleton */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Client Metrics</CardTitle>
                        <CardDescription>Overview of client-related metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Client analytics content will appear here</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Care Worker Metrics</CardTitle>
                        <CardDescription>Overview of care worker performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Care worker analytics content will appear here</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Office Staff Metrics</CardTitle>
                        <CardDescription>Overview of office staff performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Office staff analytics content will appear here</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

