"use client";

import { usePathname } from "next/navigation"
import { SidebarHeader, SidebarProvider } from "../../components/ui/sidebar"
import { SidebarLeft } from "../../components/sidebar/sidebar-left"
import { SidebarInset } from "../../components/ui/sidebar"
import { SidebarRight } from "../../components/sidebar/sidebar-right"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "../../components/ui/breadcrumb"
import { Separator } from "../../components/ui/separator"
import { SidebarTrigger } from "../../components/ui/sidebar"
import { ReactNode, useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../state/redux";
import { setUser, setOfficeStaff, setCareWorkers, setClients } from "../../state/slices/userSlice";
import { setCurrentDate, setActiveView } from "../../state/slices/calendarSlice";
import { useGetUserQuery, useGetAgencyUsersQuery, useGetAgencyByIdQuery } from "../../state/api";
import { redirect } from "next/navigation"
import * as React from "react"
import type { SidebarMode } from "../../components/scheduler/calender/types"
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { setSidebarMode } from "@/state/slices/scheduleSlice";
import { setAgency } from "@/state/slices/agencySlice";

interface DashboardLayoutProps {
    children: ReactNode
    params: {
        id: string
    }
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const { user, careWorkers, clients, officeStaff } = useAppSelector((state) => state.user)
    const { sidebarMode, isHidden } = useAppSelector((state) => state.schedule)
    const { activeView, currentDate: currentDateStr } = useAppSelector((state) => state.calendar)
    const { data: userInformation } = useGetUserQuery()
    const { data: agencyUsers } = useGetAgencyUsersQuery(userInformation?.userInfo?.agencyId || "")

    const isSchedulePage = pathname === "/dashboard/schedule"

    const { data: agency } = useGetAgencyByIdQuery(userInformation?.userInfo?.agencyId || "")





    const [isLoading, setIsLoading] = useState(true)
    const currentDate = useMemo(() => {
        const date = new Date(currentDateStr)
        return isNaN(date.getTime()) ? new Date() : date
    }, [currentDateStr])

    // Initial user dispatch - This is the first point where user data is dispatched to Redux
    // The useGetUserQuery hook fetches the user's information from the API
    // When the data is received, it's dispatched to Redux using the setUser action
    // This sets up the core user information in the Redux store
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

    // Secondary user dispatch - This sets up the different user types in the Redux store
    // After the initial user dispatch, we fetch and organize agency users by their roles
    // This separates users into three categories: care workers, office staff, and clients
    // Each category is then dispatched to its respective Redux state
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

    // Get breadcrumb items based on current path
    const getBreadcrumbItems = () => {
        const paths = pathname?.split("/").filter(Boolean) || []
        const items = []

        // Always show Dashboard as first item
        items.push({
            title: "Dashboard",
            href: "/dashboard",
            isCurrent: paths.length === 1
        })

        // Add other path segments
        let currentPath = "/dashboard"
        for (let i = 1; i < paths.length; i++) {
            currentPath += `/${paths[i]}`
            const title = paths[i].charAt(0).toUpperCase() + paths[i].slice(1)
            items.push({
                title,
                href: currentPath,
                isCurrent: i === paths.length - 1
            })
        }

        return items
    }

    // Handle toggle functions
    const handleToggleCareWorkerSelection = (staffId: string) => {
        const updatedCareWorkers = careWorkers.map((worker: any) => ({
            ...worker,
            selected: worker.id === staffId ? !worker.selected : worker.selected,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleToggleOfficeStaffSelection = (staffId: string) => {
        const updatedOfficeStaff = officeStaff.map((staff: any) => ({
            ...staff,
            selected: staff.id === staffId ? !staff.selected : staff.selected,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleToggleClientSelection = (clientId: string) => {
        const updatedClients = clients.map((client: any) => ({
            ...client,
            selected: client.id === clientId ? !client.selected : client.selected,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleSelectAllCareWorkers = () => {
        const updatedCareWorkers = careWorkers.map((worker: any) => ({
            ...worker,
            selected: true,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleDeselectAllCareWorkers = () => {
        const updatedCareWorkers = careWorkers.map((worker: any) => ({
            ...worker,
            selected: false,
        }))
        dispatch(setCareWorkers(updatedCareWorkers))
    }

    const handleSelectAllOfficeStaff = () => {
        const updatedOfficeStaff = officeStaff.map((staff: any) => ({
            ...staff,
            selected: true,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleDeselectAllOfficeStaff = () => {
        const updatedOfficeStaff = officeStaff.map((staff: any) => ({
            ...staff,
            selected: false,
        }))
        dispatch(setOfficeStaff(updatedOfficeStaff))
    }

    const handleSelectAllClients = () => {
        const updatedClients = clients.map((client: any) => ({
            ...client,
            selected: true,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleDeselectAllClients = () => {
        const updatedClients = clients.map((client: any) => ({
            ...client,
            selected: false,
        }))
        dispatch(setClients(updatedClients))
    }

    const handleSetSidebarMode = (mode: SidebarMode) => {
        dispatch(setSidebarMode(mode))
    }

    const handleViewChange = (view: "day" | "week" | "month") => {
        dispatch(setActiveView(view))
    }

    const handleDateChange = (date: Date) => {
        // Ensure we're passing a valid Date object
        if (date instanceof Date && !isNaN(date.getTime())) {
            dispatch(setCurrentDate(date.toISOString()))
        }
    }

    return (
        <SidebarProvider className="flex h-screen">

            <div className="flex h-full w-full">

                <div className="flex h-full">

                    <SidebarLeft />
                    <SidebarInset />
                </div>

                <main className="flex-1 overflow-y-auto">
                    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {getBreadcrumbItems().map((item, index) => (
                                        <React.Fragment key={item.href}>
                                            <BreadcrumbItem>
                                                {item.isCurrent ? (
                                                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {index < getBreadcrumbItems().length - 1 && <BreadcrumbSeparator />}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {children}
                    </div>
                </main>

            </div>
        </SidebarProvider>
    )
}
