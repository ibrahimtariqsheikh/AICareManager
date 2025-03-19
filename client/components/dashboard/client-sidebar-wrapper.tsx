"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
    SidebarTrigger,
} from "../ui/sidebar"
import { useSidebar } from "../ui/sidebar-provider"
import { Button } from "../ui/button"
import { User, Settings, BarChart3, Calendar, Users, Folder, HelpCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { sidebarOpt } from "../../lib/constants"
import { cn } from "../../lib/utils"

interface DashboardSidebarProps {
    id: string
    type: string
}

const DashboardSidebar = ({ id, type }: DashboardSidebarProps) => {
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar()
    const isExpanded = state === "expanded"

    // Map icon strings to components
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case "Users":
                return Users
            case "BarChart3":
                return BarChart3
            case "Calendar":
                return Calendar
            case "Settings":
                return Settings
            case "HelpCircle":
                return HelpCircle
            default:
                return Folder
        }
    }

    // Animation variants for smoother transitions
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.8,
            },
        },
        exit: {
            opacity: 0,
            x: -10,
            transition: {
                duration: 0.15,
                ease: "easeOut",
            },
        },
    }

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

    return (
        <Sidebar variant="floating" collapsible="icon" className="overflow-hidden">
            <SidebarHeader>
                <div className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"} p-2`}>
                    <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.div
                                className="flex items-center gap-2"
                                variants={logoVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Image
                                    src={type === "chatbot" ? "/assets/ncbai.svg" : "/logos/medbox.svg"}
                                    alt={type === "chatbot" ? "NoCodeBot.ai Logo" : "AICare Logo"}
                                    width={24}
                                    height={24}
                                    className="ml-1"
                                />
                                <h1 className="text-lg font-bold text-primary truncate">
                                    {type === "chatbot" ? "NoCodeBot.ai" : "AICare"}
                                </h1>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="flex items-center justify-center"
                    >
                        <SidebarTrigger className="h-7 w-7 hover:bg-gray-100 hover:text-secondary-foreground transition-colors duration-200" />
                    </motion.div>
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="px-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {sidebarOpt.map((section) => (
                        <motion.div
                            key={section.heading}
                            className="mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
                        >
                            {isExpanded && (
                                <motion.h3 className="text-xs text-muted-foreground font-medium px-2 mb-2" variants={itemVariants}>
                                    {section.heading}
                                </motion.h3>
                            )}
                            <SidebarMenu>
                                {section.items.map((item, index) => {
                                    const IconComponent = getIconComponent(item.icon)
                                    const isActive = pathname === item.link

                                    return (
                                        <SidebarMenuItem key={item.name} className="mb-1">
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={!isExpanded ? item.name : undefined}
                                                className={cn(
                                                    "py-1.5 transition-all duration-200",
                                                    isActive ? "bg-primary/10" : "hover:bg-gray-100",
                                                )}
                                            >
                                                <motion.div
                                                    whileHover={{
                                                        scale: 1.02,
                                                        transition: { duration: 0.2 },
                                                    }}
                                                    whileTap={{
                                                        scale: 0.98,
                                                        transition: { duration: 0.1 },
                                                    }}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        transition: {
                                                            delay: 0.05 * index,
                                                            duration: 0.2,
                                                        },
                                                    }}
                                                >
                                                    <Link href={item.link} className="flex items-center gap-2 px-2">
                                                        <div className={cn("flex items-center justify-center w-5 h-5", !isExpanded && "mx-auto")}>
                                                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                                                        </div>
                                                        {isExpanded && (
                                                            <motion.span className="text-xs truncate" variants={itemVariants}>
                                                                {item.name}
                                                            </motion.span>
                                                        )}
                                                    </Link>
                                                </motion.div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </SidebarContent>

            <SidebarFooter className="px-1 pb-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <motion.div
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.2 },
                            }}
                            whileTap={{
                                scale: 0.98,
                                transition: { duration: 0.1 },
                            }}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start px-2 py-1.5 gap-2 transition-colors duration-200 hover:bg-gray-100",
                                    !isExpanded && "justify-center",
                                )}
                            >
                                <div className={cn("flex items-center justify-center w-5 h-5", !isExpanded && "mx-auto")}>
                                    <User className="h-4 w-4 flex-shrink-0" />
                                </div>
                                {isExpanded && (
                                    <motion.span
                                        className="text-xs truncate"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        User Profile
                                    </motion.span>
                                )}
                            </Button>
                        </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                        <div className="space-y-1">
                            <motion.div
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    transition: { duration: 0.2 },
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-md"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start px-2 py-1.5 transition-colors duration-200"
                                    asChild
                                >
                                    <Link href="/dashboard/settings">
                                        <Settings className="mr-2 h-3.5 w-3.5" />
                                        <span className="text-xs">Settings</span>
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{
                                    scale: 1.02,
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    transition: { duration: 0.2 },
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="rounded-md"
                            >
                                <Button variant="ghost" className="w-full justify-start px-2 py-1.5 transition-colors duration-200">
                                    <User className="mr-2 h-3.5 w-3.5" />
                                    <span className="text-xs">Sign Out</span>
                                </Button>
                            </motion.div>
                        </div>
                    </PopoverContent>
                </Popover>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar
