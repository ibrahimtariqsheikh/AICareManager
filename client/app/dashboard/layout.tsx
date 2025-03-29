"use client";

import { SidebarInset } from "../../components/ui/sidebar"
import DashboardSidebar from "../../components/dashboard/client-sidebar-wrapper"
import { redirect } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"

interface DashboardLayoutProps {
    children: ReactNode
    params: {
        id: string
    }
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const { user } = useAuthenticator((context) => [context.user])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in
        if (!user) {
            window.location.href = "/"
        } else {
            setIsLoading(false)
        }
    }, [user])

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    // Default to workspace type if not specified
    const type = "workspace"

    return (
        <div className="flex h-screen overflow-hidden bg-background w-full">
            <DashboardSidebar id={params.id} type={type} />
            <SidebarInset className="flex-1 overflow-auto">
                <div className="h-full max-w-full p-4 md:p-6">{children}</div>
            </SidebarInset>
        </div>
    )
}
