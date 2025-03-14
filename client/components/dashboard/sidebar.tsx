"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Calendar, Settings, LogOut, Home } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
} from "../../components/ui/sidebar"

export function DashboardSidebar() {
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const menuItems = [
        {
            title: "Dashboard",
            icon: Home,
            href: "/dashboard",
        },
        {
            title: "User Management",
            icon: Users,
            href: "/dashboard/users",
        },
        {
            title: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
        },
        {
            title: "Schedule",
            icon: Calendar,
            href: "/dashboard/schedule",
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
    ]

    if (!isMounted) return null

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="border-b">
                <div className="flex h-14 items-center px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <span className="text-xl">CareManage</span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.title}
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/auth/signout">
                                <LogOut className="h-5 w-5" />
                                <span>Sign Out</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
            <SidebarTrigger className="absolute left-4 top-4 md:hidden" />
        </Sidebar>
    )
}
