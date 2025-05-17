"use client";

import { usePathname } from "next/navigation"
import { SidebarProvider } from "../../components/ui/sidebar"
import { SidebarLeft } from "../../components/sidebar/sidebar-left"
import { SidebarInset } from "../../components/ui/sidebar"
import { SidebarTrigger } from "../../components/ui/sidebar"
import { ReactNode, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../state/redux";
import { setUser, setOfficeStaff, setCareWorkers, setClients } from "../../state/slices/userSlice";
import { useGetUserQuery, useGetAgencyUsersQuery, useGetAgencyByIdQuery } from "../../state/api";
import { redirect } from "next/navigation"
import * as React from "react"


import { setAgency } from "@/state/slices/agencySlice";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface DashboardLayoutProps {
    children: ReactNode
    params: {
        id: string
    }
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.user)
    const { data: userInformation } = useGetUserQuery()
    const { data: agencyUsers } = useGetAgencyUsersQuery(userInformation?.userInfo?.agencyId || "")

    const isSchedulePage = pathname === "/dashboard/schedule"
    const { data: agency } = useGetAgencyByIdQuery(userInformation?.userInfo?.agencyId || "")
    const [isLoading, setIsLoading] = useState(true)
    const { theme } = useTheme()

    useEffect(() => {
        if (userInformation) {
            dispatch(setUser(userInformation))

            setIsLoading(false)
        }
    }, [userInformation, dispatch])


    useEffect(() => {
        if (agency) {
            dispatch(setAgency(agency))
        }
    }, [agency, dispatch])


    useEffect(() => {
        if (agencyUsers?.data) {
            const careWorkers = agencyUsers.data.filter((user: any) => user.role === "CARE_WORKER")
            const officeStaff = agencyUsers.data.filter((user: any) => user.role === "OFFICE_STAFF")
            const clients = agencyUsers.data.filter((user: any) => user.role === "CLIENT")

            dispatch(setCareWorkers(careWorkers))
            dispatch(setOfficeStaff(officeStaff))
            dispatch(setClients(clients))
        }
    }, [agencyUsers, dispatch])

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <div className="flex h-full w-full">
                    {/* Left sidebar skeleton */}
                    <div className="flex h-full">
                        <div className="w-64 bg-muted animate-pulse" />
                        <div className="w-12 bg-muted/50 animate-pulse" />
                    </div>

                    {/* Main content skeleton */}
                    <main className="flex-1 overflow-y-auto">
                        {/* Header skeleton */}
                        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                            <div className="flex flex-1 items-center gap-2 px-3">
                                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-[1px] bg-muted mr-2" />
                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            </div>
                        </header>

                        {/* Content area skeleton */}
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                            <div className="grid gap-4">
                                <div className="h-32 bg-muted rounded animate-pulse" />
                                <div className="h-32 bg-muted rounded animate-pulse" />
                                <div className="h-32 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    </main>

                    {/* Right sidebar skeleton (only shown on schedule page) */}
                    {isSchedulePage && (
                        <div className="w-80 bg-muted animate-pulse" />
                    )}
                </div>
            </div>
        );
    }

    if (!user) {
        redirect("/login")
    }

    const currentPath = pathname.split("/").filter(Boolean)
    const currentPathTitle = currentPath[currentPath.length - 1]
    const currentPathTitleCapitalized =
        currentPathTitle
            ? `${currentPathTitle.charAt(0).toUpperCase()}${currentPathTitle.slice(1)}`
            : "Dashboard"


    return (
        <SidebarProvider className="flex h-screen">
            <div className="flex h-full w-full">
                <div className="flex h-full">
                    <SidebarLeft />
                    <SidebarInset />
                </div>

                <main className="flex-1 overflow-y-auto">
                    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background z-50">
                        <div className="flex flex-1 items-center gap-2 px-3 ">
                            <SidebarTrigger className={cn("bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 shadow-none", theme === "dark" ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700" : "")} />
                            <Separator orientation="vertical" className={cn(" h-4", theme === "dark" ? "bg-neutral-800" : "bg-neutral-200")} />
                            <h1 className="text-sm font-medium">{currentPathTitleCapitalized || "Dashboard"}</h1>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4">
                        {children}
                    </div>
                </main>

            </div>
        </SidebarProvider>
    )
}
