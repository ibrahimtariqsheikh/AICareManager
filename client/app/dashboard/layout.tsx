"use client";

import { usePathname } from "next/navigation"
import { SidebarProvider } from "../../components/ui/sidebar"
import { SidebarLeft } from "../../components/sidebar/sidebar-left"
import { SidebarInset } from "../../components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "../../components/ui/breadcrumb"
import { Separator } from "../../components/ui/separator"
import { SidebarTrigger } from "../../components/ui/sidebar"
import { ReactNode, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../state/redux";
import { setUser, setOfficeStaff, setCareWorkers, setClients } from "../../state/slices/userSlice";
import { useGetUserQuery, useGetAgencyUsersQuery, useGetAgencyByIdQuery } from "../../state/api";
import { redirect } from "next/navigation"
import * as React from "react"



import { setAgency } from "@/state/slices/agencySlice";

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
            const pathSegment = paths[i]
            if (!pathSegment) continue
            currentPath += `/${pathSegment}`
            const title = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)
            items.push({
                title,
                href: currentPath,
                isCurrent: i === paths.length - 1
            })
        }

        return items
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
