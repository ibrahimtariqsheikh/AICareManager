"use client"

import type * as React from "react"
import {
    LayoutDashboardIcon,
    UsersIcon,
    BarChart3,
    Calendar,
    Settings,
    HelpCircle,
    Command,
    LogOut,
    Moon,
    Sun,
    Building2,
    Bot,
    Mail,
    File,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "../../lib/utils"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarRail } from "../../components/ui/sidebar"
import { useAppSelector, useAppDispatch } from "../../state/redux"
import { signOut } from "aws-amplify/auth"
import { logout } from "../../state/slices/authSlice"
import { Badge } from "../ui/badge"

interface NavigationItem {
    title: string
    icon: React.ComponentType<{ className?: string }>
    href: string
    isActive?: boolean
    isBeta?: boolean
}

interface NavigationSection {
    title: string
    items: NavigationItem[]
}



// Navigation data
const navigation: NavigationSection[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                icon: LayoutDashboardIcon,
                href: "/dashboard",
                isActive: true,
            },
            {
                title: "AI Assistant",
                icon: Bot,
                href: "/dashboard/chatbot",
                isBeta: true,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Users",
                icon: UsersIcon,
                href: "/dashboard/users",
            },

            {
                title: "Reports",
                icon: File,
                href: "/dashboard/reports",
            },
            {
                title: "Schedule",
                icon: Calendar,
                href: "/dashboard/schedule",
            },


            {
                title: "Invites",
                icon: Mail,
                href: "/dashboard/invites",
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Preferences",
                icon: Settings,
                href: "/dashboard/settings",
            },
            {
                title: "Help",
                icon: HelpCircle,
                href: "/dashboard/help",
            },
        ],
    },
]

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut()
            dispatch(logout())
            localStorage.removeItem("user")
            sessionStorage.removeItem("token")
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader className="p-4 mt-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black/10">
                        <Building2 className="h-4 w-4 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            AI Care Manager
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {user?.userInfo?.agency?.name || "Agency"}
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4">
                {navigation.map((section) => (
                    <div key={section.title} className="space-y-2 mb-6">
                        <h3 className="px-2 text-xs font-semibold text-muted-foreground">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                            isActive
                                                ? "bg-accent text-accent-foreground font-medium"
                                                : "hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span className="flex items-center gap-2 text-xs justify-between w-full">
                                            {item.title}
                                            {item.isBeta && (
                                                <Badge variant="outline" className="bg-primary/10 text-primary text-[10px]">
                                                    Beta
                                                </Badge>
                                            )}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t py-4">
                <div className="flex items-center justify-between">
                    <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <div className="w-full cursor-pointer">
                                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {user?.userInfo?.firstName?.[0]}
                                            {user?.userInfo?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">
                                            {user?.userInfo?.firstName} {user?.userInfo?.lastName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user?.userInfo?.email}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? (
                                    <>
                                        <Sun className="mr-2 h-3 w-3" />
                                        <span className="text-sm font-medium">Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="mr-2 h-3 w-3" />
                                        <span className="text-sm font-medium">Dark Mode</span>
                                    </>
                                )}

                            </DropdownMenuItem>
                            <div className="border-b border-border w-[90%] mx-auto my-2" />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-3 w-3" />
                                <span className="text-sm font-medium">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
