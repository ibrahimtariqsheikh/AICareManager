"use client"

import type * as React from "react"
import {
    LayoutDashboardIcon,
    UsersIcon,
    Calendar,
    Settings,
    HelpCircle,
    LogOut,
    Moon,
    Sun,

    File,

    CreditCard,
    MessageCircle,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn, getRandomPlaceholderImage } from "../../lib/utils"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,

    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from "../ui/sidebar"
import { useAppSelector, useAppDispatch } from "../../state/redux"
import { signOut } from "aws-amplify/auth"
import { logout } from "../../state/slices/authSlice"

import Image from "next/image"
import ChatbotModern from "../icons/chatbot-modern"
import { User } from "@/types/prismaTypes"


{/* <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <ChevronDown className="h-3.5 w-3.5 text-neutral-600" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col space-y-2 p-2">
                                <div className="flex flex-row items-center gap-2">
                                    <Building2 className="h-4 w-4 text-neutral-900" />
                                    <h4 className="font-semibold text-sm">Switch Agency</h4>

                                </div>
                                <p className="text-xs text-neutral-600 pb-2">
                                    Switch to a different agency to manage.
                                </p>
                                <div className="border-b border-border w-[95%] mx-auto my-2" />
                                <div className="text-xs text-muted-foreground w-full flex flex-col gap-2">
                                    {agencyList?.map((agency: any, index: number) => (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-neutral-900">{index + 1}.</span>
                                            <div className="text-neutral-700 cursor-pointer hover:bg-neutral-200/70 bg-neutral-100 rounded-md py-2 px-4 flex-1">
                                                {agency.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Button className="w-full mt-2">
                                        <Plus className="h-4 w-4" />
                                        <span className="text-xs font-medium">Create New Agency</span>
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover> */}

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
                title: "Aim Assist",
                icon: ChatbotModern,
                href: "/dashboard/aimassist",
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
                title: "Messages",
                icon: MessageCircle,
                href: "/dashboard/contacts",
            },
            {
                title: "Schedule",
                icon: Calendar,
                href: "/dashboard/schedule",
            },
            {
                title: "Reports",
                icon: File,
                href: "/dashboard/reports",
            },


            {
                title: "Billing",
                icon: CreditCard,
                href: "/dashboard/billing",
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
    const { user: userInformation } = useAppSelector((state) => state.user)
    const user = userInformation?.userInfo as User
    const dispatch = useAppDispatch()
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const { setOpenMobile } = useSidebar()

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

    const handleNavigation = (href: string) => {
        setOpenMobile(false)
        router.push(href)
    }

    return (
        <Sidebar className={cn("border-r-0 w-[250px]", theme === "dark" ? "bg-[#171717]" : "bg-[#f6f7f9]")} {...props}>
            <SidebarHeader className="m-0 p-0 flex items-center justify-center ">
                <div className="flex flex-col items-center flex-1">
                    <Image src="/assets/aimlogo.png" alt="AI Manager" width={55} height={55} />
                </div>

            </SidebarHeader>
            <div className="border-b border-border w-[100%] mx-auto my-1" />
            <SidebarContent className="px-3 py-4">


                {navigation.map((section) => (
                    <div key={section.title} className="space-y-2 mb-6">
                        <h3 className={cn("px-2 text-[11px] font-semibold", theme === "dark" ? "text-neutral-400" : "text-neutral-500/80")}>
                            {section.title.toUpperCase()}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => handleNavigation(item.href)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-xs transition-colors w-full",
                                            isActive ? cn("bg-neutral-800/70 text-black font-medium", theme === "dark" ? "bg-neutral-800/70 text-neutral-100" : "bg-neutral-200/70 text-black") : cn("hover:bg-neutral-200/70 hover:text-black", theme === "dark" ? "hover:bg-neutral-800/70 hover:text-neutral-100" : "hover:bg-neutral-200/70 hover:text-black")
                                        )}
                                    >
                                        <item.icon className={cn("h-4 w-4", theme === "dark" ? "text-neutral-300" : "text-neutral-800")} />
                                        <span className={cn("flex items-center gap-2 text-[13px] justify-between w-full", theme === "dark" ? "text-neutral-300" : "text-neutral-800")}>
                                            {item.title}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </SidebarContent>
            <SidebarFooter className="my-4">

                <div className="flex items-center justify-between border-t border-border pt-4">
                    <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <div className="w-full cursor-pointer">
                                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={getRandomPlaceholderImage()} alt={user?.fullName} />
                                        <AvatarFallback className="bg-blue-400/20 text-blue-600">
                                            {user?.fullName?.[0]}

                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-semibold ">
                                            {user?.fullName}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            {user?.email}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 py-2">
                            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? (
                                    <>
                                        <Sun className="mr-2 h-3 w-3" />
                                        <span className="text-xs font-medium text-neutral-900">Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="mr-2 h-3 w-3" />
                                        <span className="text-xs font-medium text-neutral-900">Dark Mode</span>
                                    </>
                                )}

                            </DropdownMenuItem>
                            <div className="border-b border-border w-[90%] mx-auto my-2" />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-3 w-3" />
                                <span className="text-xs font-medium">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>

        </Sidebar >
    )
}
