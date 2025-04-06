"use client"

import { Suspense } from "react"
import { InvitesDashboard } from "../../../components/users/invites-dashboard"

function LoadingSkeleton() {
    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* User Type Tabs Skeleton */}
            <div className="flex border-b border-gray-200">
                {["Clients", "Care Workers", "Office Staff"].map((type) => (
                    <div key={type} className="flex items-center gap-2 px-4 py-2">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* User Content Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                </div>

                {/* User Table Skeleton */}
                <div className="border rounded-lg">
                    <div className="p-4 border-b">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="divide-y">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InvitesPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <InvitesDashboard />
        </Suspense>
    );
}

