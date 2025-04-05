"use client"

import { Suspense } from "react"
import { LoadingSpinner } from "../../../components/ui/loading-spinner"
import { InvitesDashboard } from "../../../components/users/invites-dashboard"


export default function InvitesPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <InvitesDashboard />
        </Suspense>
    )
}

