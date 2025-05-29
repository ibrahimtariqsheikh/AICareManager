"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Pill, UserIcon, Code, Loader2, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { User as UserType } from "@/types/prismaTypes"
import { useGetUserByIdQuery } from "@/state/api"
import { PatientInformation } from "../components/patient-information"
import { Reports } from "../components/user-reports"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getRandomPlaceholderImage } from "@/lib/utils"
import AppointmentHistory from "../components/appointmenthistory"
import { EMAR } from "../components/emar"
import { ScheduleTemplate } from "../components/scheduleTemplate"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setActiveEditUserTab } from "@/state/slices/tabsSlice"
import { useEffect, useState, useRef } from "react"
import CarePlan from "../components/care-plan"
import RiskAssessment from "../components/risk-assessment"
import DocumentsEdit from "../components/documents-edit"

const EditUserPage = () => {
    const { id } = useParams()
    const userId = id as string
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [tabInitialized, setTabInitialized] = useState(false)
    const [hoveredIndex] = useState<number | null>(null)
    const [, setHoverStyle] = useState({})
    const [, setActiveStyle] = useState({ left: "0px", width: "0px" })
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    const formatRole = (role: string) => {
        return role
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }
    const formatSubRole = (subRole: string) => {
        return subRole
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    // Function to check if tab should be visible based on user role
    const shouldShowTab = (tabId: string) => {
        if (!user) return false;

        const roleBasedTabs = {
            CARE_WORKER: ["information", "appointmentHistory", "reports", "documents"],
            OFFICE_STAFF: ["information", "documents"],
            ADMIN: ["information", "appointmentHistory", "reports", "emar", "scheduleTemplate", "carePlan", "riskAssessment", "documents"],
            // Add more roles and their allowed tabs as needed
        };

        // If role not defined in rules, show all tabs
        if (!roleBasedTabs[user.role as keyof typeof roleBasedTabs]) {
            return true;
        }

        return roleBasedTabs[user.role as keyof typeof roleBasedTabs].includes(tabId);
    };

    const activeTab = useAppSelector((state) => state.tabs?.activeEditUserTab) || "information"

    const {
        data: userData,
        isLoading,
        error,
    } = useGetUserByIdQuery(userId || "", {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    })

    const user = userData?.data as UserType

    // Initialize the tab state on component mount
    useEffect(() => {
        // Only initialize once and do it safely with setTimeout
        if (!tabInitialized) {
            setTimeout(() => {
                try {
                    dispatch(setActiveEditUserTab("information"));
                    setTabInitialized(true);
                } catch (error) {
                    console.error("Failed to initialize tab state:", error);
                }
            }, 0);
        }
    }, [dispatch, tabInitialized]);

    useEffect(() => {
        if (hoveredIndex !== null) {
            const hoveredElement = tabRefs.current[hoveredIndex]
            if (hoveredElement) {
                const { offsetLeft, offsetWidth } = hoveredElement
                setHoverStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                })
            }
        }
    }, [hoveredIndex])

    useEffect(() => {
        const activeElement = tabRefs.current[tabs.findIndex(tab => tab.id === activeTab)]
        if (activeElement) {
            const { offsetLeft, offsetWidth } = activeElement
            setActiveStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            })
        }
    }, [activeTab])

    const contentVariants = {
        hidden: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
    }
    const tabs = [
        {
            id: "information",
            label: user?.role === "CARE_WORKER"
                ? "Care Worker Information"
                : user?.role === "CLIENT"
                    ? "Client Information"
                    : "User Information",
            icon: UserIcon
        },
        { id: "appointmentHistory", label: "Appointment History", icon: Calendar },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "emar", label: "EMAR", icon: Pill },
        { id: "scheduleTemplate", label: "Schedule Template", icon: Calendar },
        { id: "carePlan", label: "Care Plan", icon: FileText },
        { id: "riskAssessment", label: "Risk Assessment", icon: Shield },
        { id: "documents", label: "Documents", icon: FileText },
    ]

    // Handle tab change
    const handleTabChange = (value: string) => {
        try {
            dispatch(setActiveEditUserTab(value))
        } catch (error) {
            console.error("Error changing tab:", error)
        }
    }

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-4 sm:p-6 mx-4 sm:mx-10">
                {/* Skeleton for user header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 items-start sm:items-center justify-between mx-0 sm:mx-4">
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <div>
                                <Skeleton className="h-8 w-48" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-24 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="px-2 sm:px-6 py-4">
                    {/* Skeleton for tabs */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-9 w-24 sm:w-36 rounded-md" />
                        ))}
                    </div>
                    <div className="border-b border-border w-full h-1 my-4 sm:my-8" />

                    {/* Skeleton for content */}
                    <div className="min-h-[400px] space-y-4">
                        <Skeleton className="h-10 w-1/2 sm:w-1/4" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skeleton for action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-start sm:justify-end">
                        <Skeleton className="h-10 w-full sm:w-24" />
                        <Skeleton className="h-10 w-full sm:w-36" />
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4">
                <div className="text-destructive text-lg sm:text-xl font-semibold mb-2 text-center">Error loading user data</div>
                <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base">There was a problem fetching the user information.</p>
                <Button onClick={() => router.back()} className="w-full sm:w-auto">Go Back</Button>
            </div>
        )
    }

    // No user data found
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4">
                <div className="text-foreground text-lg sm:text-xl font-semibold mb-2 text-center">User not found</div>
                <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base">The requested user could not be found.</p>
                <Button onClick={() => router.back()} className="w-full sm:w-auto">Go Back</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 p-4 sm:p-6">
            {/* User Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col sm:flex-row gap-4 sm:gap-2 items-start sm:items-center justify-between mx-0 sm:mx-4"
                >
                    <div className="flex flex-row gap-4 items-center justify-between w-full sm:w-auto">
                        <Avatar className="w-12 h-12 sm:w-16 sm:h-16 bg-muted flex items-center justify-center text-foreground font-semibold text-sm flex-shrink-0">
                            <AvatarImage src={getRandomPlaceholderImage()} />
                            <AvatarFallback>
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-2xl font-bold truncate">{user?.fullName || "Unknown User"}</h1>
                            <h1 className="text-xs sm:text-sm text-neutral-500 truncate">{user?.email || "Unknown Email"}</h1>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center w-full sm:w-auto justify-start sm:justify-end">
                        <p className="text-xs text-primary bg-primary/5 px-2 py-1 rounded-md font-medium border border-primary/30 whitespace-nowrap">
                            {formatRole(user?.role) || "No Role"}
                        </p>
                        <p className="text-xs text-primary bg-primary/5 px-2 py-1 rounded-md font-medium border border-primary/30 whitespace-nowrap">
                            {formatSubRole(user?.subRole) || "No Subrole"}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="px-2 sm:px-6 py-4">
                {/* Tabs Navigation */}
                <div className="relative">
                    {/* Tabs */}
                    <div className="relative flex flex-wrap gap-2 sm:gap-[6px] items-center">
                        {tabs.map((tab, index) => (
                            shouldShowTab(tab.id) && (
                                <div
                                    key={tab.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el;
                                    }}
                                    className={`px-2 sm:px-3 py-2 cursor-pointer transition-all duration-300 h-[30px] text-xs sm:text-sm ${tab.id === activeTab
                                        ? "bg-primary/10 rounded-md text-primary"
                                        : "text-[#0e0f1199] dark:text-[#ffffff99] border border-border rounded-md hover:border-primary/50 hover:bg-primary/5 hover:text-primary/80"
                                        }`}
                                    onClick={() => handleTabChange(tab.id)}
                                >
                                    <div className="font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full gap-1 sm:gap-2">
                                        <tab.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tab.id === activeTab ? "text-primary" : ""}`} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">
                                            {tab.label.split(' ')[0]}
                                        </span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="w-full h-1 my-2" />

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {tabs.map((tab) => (
                        <div key={tab.id} className={tab.id === activeTab ? "block" : "hidden"}>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                {tab.id === "information" && <PatientInformation user={user} />}
                                {tab.id === "appointmentHistory" && <AppointmentHistory user={user} />}
                                {tab.id === "reports" && shouldShowTab("reports") && <Reports user={user} />}
                                {tab.id === "emar" && <EMAR user={user} />}
                                {tab.id === "scheduleTemplate" && <ScheduleTemplate user={user} />}
                                {tab.id === "carePlan" && <CarePlan user={user} />}
                                {tab.id === "riskAssessment" && <RiskAssessment />}
                                {tab.id === "documents" && <DocumentsEdit />}
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Debug Panel */}
            {user && (
                <Collapsible className="mt-8 border rounded-md">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium">
                        <div className="flex items-center">
                            <Code className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Debug: User Data</span>
                            <span className="sm:hidden">Debug</span>
                        </div>
                        <span className="text-xs text-muted-foreground hidden sm:inline">Click to expand</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-4 bg-muted/50 rounded-b-md overflow-auto max-h-[300px] sm:max-h-[500px]">
                            <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(user, null, 2)}</pre>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    )
}

export default EditUserPage