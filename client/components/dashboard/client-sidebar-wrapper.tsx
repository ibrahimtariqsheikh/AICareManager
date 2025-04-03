"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "../ui/sidebar"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight, ChevronDown, HelpCircle, Users, LogOut, Moon, Sun } from "lucide-react"
import { cn } from "../../lib/utils"
import { useTheme } from "next-themes"
import { useSidebar } from "../ui/sidebar-provider"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAppSelector, useAppDispatch } from "../../state/redux"
import { signOut } from "aws-amplify/auth"
import { logout } from "../../state/slices/authSlice"

import { LayoutDashboardIcon, UsersIcon, BarChart3, Calendar, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useMediaQuery } from "../../hooks/use-mobile"
import { useGetUserQuery } from "../../state/api"

export interface NavItem {
    title: string
    icon: LucideIcon
    href: string
    isActive?: boolean
}

export interface NavSection {
    title: string
    items: NavItem[]
}

export const sidebarNavigation: NavSection[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                icon: LayoutDashboardIcon,
                href: "/dashboard",
                isActive: true,
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
                title: "Analytics",
                icon: BarChart3,
                href: "/dashboard/analytics",
            },
            {
                title: "Schedule",
                icon: Calendar,
                href: "/dashboard/schedule",
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

interface DashboardSidebarProps {
    id: string
    type: string
}

const DashboardSidebar = ({ id, type }: DashboardSidebarProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const { state, toggleSidebar } = useSidebar()
    const isExpanded = state === "expanded"
    const { theme, setTheme } = useTheme()
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Get user data from Redux store
    const { user } = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()
    console.log("Prisma User", user)

    const { data: authUser } = useGetUserQuery();

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
        // Initialize all sections as expanded by default
        sidebarNavigation.reduce(
            (acc, section) => {
                acc[section.title] = true
                return acc
            },
            {} as Record<string, boolean>,
        ),
    )

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleSection = (sectionTitle: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle],
        }))
    }

    const handleLogout = async () => {
        try {
            // Sign out using AWS Amplify
            await signOut()

            // Dispatch logout action to Redux
            dispatch(logout())

            console.log("Logging out...")
            setUserDropdownOpen(false)

            // Redirect to login page
            window.location.href = "/"
        } catch (error) {
            console.error("Error logging out:", error)
        }
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    // Animation variants for smoother transitions
    const logoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.8,
                delay: 0.05,
            },
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.15,
                ease: "easeOut",
            },
        },
    }

    // Sidebar animation
    const sidebarVariants = {
        expanded: {
            width: isMobile ? "80px" : "240px",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        collapsed: {
            width: "80px",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
    }

    // Footer animation
    const footerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.8,
                delay: 0.1,
            },
        },
    }

    // Dropdown animation
    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
            },
        },
    }

    // Determine if we should show text labels
    const showLabels = isExpanded && !isMobile

    return (
        <MotionConfig reducedMotion="user">
            <motion.div
                className="h-full flex flex-col"
                initial={false}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={sidebarVariants}
            >
                <Sidebar
                    variant="sidebar"
                    collapsible="icon"
                    className={cn(
                        "overflow-hidden h-full flex flex-col",
                        theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-[#F9F9FB]",
                    )}
                >
                    <SidebarHeader>
                        <div className={cn("flex items-center mt-3", isExpanded ? "justify-between" : "justify-center")}>
                            <AnimatePresence mode="wait">
                                {isExpanded && !isMobile && (
                                    <motion.div
                                        className="flex items-center gap-2"
                                        variants={logoVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <div className="flex h-full w-full justify-center items-center gap-2">
                                            <motion.div
                                                className={cn("w-6 h-6 rounded-md", theme === "dark" ? "bg-primary/20" : "bg-primary/10")}
                                                whileHover={{
                                                    scale: 1.05,
                                                    backgroundColor: "var(--primary-light)",
                                                    transition: { duration: 0.2 },
                                                }}
                                            />
                                            <div className="flex justify-center flex-col">
                                                <motion.h1
                                                    className="text-md font-bold text-primary truncate mb-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    AI Care Manager
                                                </motion.h1>
                                                <motion.p
                                                    className="text-muted-foreground text-xs"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {authUser?.userInfo?.agency?.name || "Agency"}
                                                </motion.p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {isExpanded && isMobile && (
                                    <motion.div
                                        className="flex items-center justify-center"
                                        variants={logoVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <motion.div
                                            className={cn("w-6 h-6 rounded-md", theme === "dark" ? "bg-primary/20" : "bg-primary/10")}
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "var(--primary-light)",
                                                transition: { duration: 0.2 },
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={cn(
                                        "h-6 w-6 transition-colors duration-200",
                                        theme === "dark"
                                            ? "hover:bg-zinc-800 hover:text-zinc-200"
                                            : "hover:bg-gray-100 hover:text-secondary-foreground",
                                    )}
                                    onClick={toggleSidebar}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ rotate: isExpanded ? 0 : 180 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        {isExpanded ? (
                                            <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                                        ) : (
                                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                        )}
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </div>
                    </SidebarHeader>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <div
                            className={cn("my-4 w-[80%] mx-auto border-b", theme === "dark" ? "border-zinc-700" : "border-gray-200")}
                        />
                    </motion.div>

                    <SidebarContent className="flex flex-col gap-4 w-[80%] mx-auto flex-1">
                        {/* Map through navigation sections */}
                        {sidebarNavigation.map((section) => (
                            <div key={section.title} className="flex flex-col gap-2">
                                {/* Section Header - Only show when expanded */}
                                {!isMobile && isExpanded && (
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSection(section.title)}>
                                        <div className="text-xs font-medium text-muted-foreground">{section.title}</div>
                                        <motion.div
                                            animate={{ rotate: expandedSections[section.title] ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                        </motion.div>
                                    </div>
                                )}

                                {/* Section Items */}
                                {(expandedSections[section.title] || isMobile) && (
                                    <div className="flex flex-col gap-1">
                                        {section.items.map((item) => (
                                            <motion.div
                                                key={item.title}
                                                className={cn(
                                                    "flex items-center gap-2 rounded-md p-2 cursor-pointer",
                                                    pathname === item.href && (theme === "dark" ? "bg-primary/10" : "bg-primary/5"),
                                                    isMobile && "justify-center",
                                                )}
                                                whileHover={{
                                                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                    borderRadius: "6px",
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => router.push(item.href)}
                                            >
                                                <motion.div whileHover={{ rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                                                    <item.icon className="h-4 w-4" />
                                                </motion.div>
                                                {showLabels && <div className="text-xs font-medium">{item.title}</div>}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </SidebarContent>

                    {/* User Profile Footer */}
                    <SidebarFooter className="mt-auto mx-auto mb-4">
                        <motion.div variants={footerVariants} initial="hidden" animate="visible" className="mt-auto">
                            <div className={cn("my-2 border-b", theme === "dark" ? "border-zinc-700" : "border-gray-200")} />

                            {/* Quick Action Buttons */}
                            <div className="flex flex-col gap-2 mb-4">
                                <motion.div
                                    className={cn("flex items-center gap-2 rounded-md p-2 cursor-pointer", isMobile && "justify-center")}
                                    whileHover={{
                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        borderRadius: "6px",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    {showLabels && <div className="text-xs font-medium">Help Center</div>}
                                </motion.div>

                                <motion.div
                                    className={cn("flex items-center gap-2 rounded-md p-2 cursor-pointer", isMobile && "justify-center")}
                                    whileHover={{
                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        borderRadius: "6px",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={toggleTheme}
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    {showLabels && (
                                        <div className="text-xs font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</div>
                                    )}
                                </motion.div>

                                <motion.div
                                    className={cn("flex items-center gap-2 rounded-md p-2 cursor-pointer", isMobile && "justify-center")}
                                    whileHover={{
                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        borderRadius: "6px",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Users className="h-4 w-4" />
                                    {showLabels && <div className="text-xs font-medium">Invite teams</div>}
                                </motion.div>
                            </div>

                            <div className={cn("my-2 border-b", theme === "dark" ? "border-zinc-700" : "border-gray-200")} />

                            {/* User Profile with Custom Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <motion.div
                                    className={cn("flex items-center gap-2 p-2 rounded-md cursor-pointer", isMobile && "justify-center")}
                                    whileHover={{
                                        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                        borderRadius: "6px",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={""} alt={"hello"} />
                                        <AvatarFallback>
                                            {"I"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {showLabels && (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {authUser?.userInfo?.agency?.name || "Agency"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {authUser?.userInfo?.firstName} {authUser?.userInfo?.lastName}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Custom Motion Dropdown */}
                                <AnimatePresence>
                                    {userDropdownOpen && (
                                        <motion.div
                                            className={cn(
                                                "absolute bottom-full mb-2 -right-4 w-56 rounded-md shadow-lg p-1 z-50",
                                                theme === "dark" ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200",
                                            )}
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        >
                                            <motion.div
                                                className="p-2 flex items-center gap-2"
                                                whileHover={{
                                                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                                    borderRadius: "4px",
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span className="text-sm">Log out</span>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </SidebarFooter>
                </Sidebar>
            </motion.div>
        </MotionConfig>
    )
}

export default DashboardSidebar

