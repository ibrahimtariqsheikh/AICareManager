"use client"

import React, { ReactNode } from "react"
import { SidebarInset } from "../../components/ui/sidebar"
import DashboardSidebar from "../../components/dashboard/client-sidebar-wrapper"

interface DashboardLayoutProps {
    children: ReactNode
    params: {
        id: string
    }
}

const DashboardLayout = ({ children, params }: DashboardLayoutProps) => {
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

export default DashboardLayout
