"use client"

import { Suspense } from "react"
import { UserDashboard } from "../../../components/users/user-dashboard"
import { LoadingSpinner } from "../../../components/ui/loading-spinner"


export default function UsersPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <UserDashboard />
        </Suspense>
    )
}

