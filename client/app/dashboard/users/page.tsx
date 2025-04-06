"use client"

import { Suspense } from "react"
import { UserDashboard } from "../../../components/users/user-dashboard"

function LoadingSkeleton() {
    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-[220px] bg-muted rounded animate-pulse" />
                    <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex border-b border-gray-200">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                </div>

                <div className="border rounded-lg shadow-sm">
                    <div className="p-4 space-y-4">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                            ))}
                        </div>
                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div key={row} className="grid grid-cols-6 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((col) => (
                                    <div key={col} className="h-8 bg-muted rounded animate-pulse" />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function UsersPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <UserDashboard />
        </Suspense>
    )
}

