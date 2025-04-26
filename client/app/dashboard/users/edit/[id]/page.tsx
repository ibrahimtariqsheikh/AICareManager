"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Pill, UserIcon, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { User as UserType } from "@/types/prismaTypes"
import { useGetUserByIdQuery } from "@/state/api"
import { PatientInformation } from "../components/patient-information"
import AppointmentHistory from "../components/appointmenthistory"
import { MedicalHistory } from "../components/medicalHistory"
import { EMAR as EMARComponent } from "../components/emar"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleTemplate } from "../components/scheduleTemplate"

const EditUserPage = () => {
    const { id } = useParams()
    const userId = id as string
    const router = useRouter()

    const {
        data: userData,
        isLoading,
        error,
    } = useGetUserByIdQuery(userId || "", {
        skip: !userId,
        refetchOnMountOrArgChange: true,
    })

    const user = userData?.data as UserType

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
        { id: "patientInformation", label: "Patient Information", icon: UserIcon },
        { id: "AppointmentHistory", label: "Appointment History", icon: Calendar },
        { id: "MedicalHistory", label: "Medical History", icon: FileText },
        { id: "EMAR", label: "EMAR", icon: Pill },
        { id: "ScheduleTemplate", label: "Schedule Template", icon: Calendar },
    ]

    // Skeleton loading state
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-6 mx-10">
                {/* Skeleton for user header */}
                <div className="flex flex-row gap-4 items-center">
                    <div className="w-full flex flex-row gap-2 items-center justify-between mx-4">
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

                <div className="px-6 py-4">
                    {/* Skeleton for tabs */}
                    <div className="flex flex-row gap-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-9 w-36 rounded-md" />
                        ))}
                    </div>
                    <div className="border-b border-border w-full h-1 my-8" />

                    {/* Skeleton for content */}
                    <div className="min-h-[400px] space-y-4">
                        <Skeleton className="h-10 w-1/4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skeleton for action buttons */}
                    <div className="flex flex-row gap-4 mt-8 justify-end">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-36" />
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-destructive text-xl font-semibold mb-2">Error loading user data</div>
                <p className="text-muted-foreground mb-4">There was a problem fetching the user information.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    // No user data found
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-foreground text-xl font-semibold mb-2">User not found</div>
                <p className="text-muted-foreground mb-4">The requested user could not be found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 p-6 mx-10">
            {/* User Header */}
            <div className="flex flex-row gap-4 items-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-row gap-2 items-center justify-between mx-4"
                >
                    <div className="flex flex-row gap-2 items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-semibold text-sm">
                            {user?.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.fullName || "Unknown User"}</h1>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md font-medium border border-primary/30">
                            {user?.role || "No Role"}
                        </p>
                        <p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium border border-border">
                            {user?.subRole || "No Subrole"}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="px-6 py-4">
                {/* Tabs Navigation using shadcn Tabs */}
                <Tabs defaultValue="patientInformation" className="w-full">
                    <TabsList className="h-auto">
                        {tabs.map((tab, index) => (
                            <TabsTrigger key={tab.id || `tab-${index}`} value={tab.id} className="flex items-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className=" w-full h-1 my-4" />

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        <TabsContent value="patientInformation" asChild>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                <PatientInformation user={user} />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="AppointmentHistory" asChild>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                <AppointmentHistory user={user} />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="MedicalHistory" asChild>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                <MedicalHistory user={user} />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="EMAR" asChild>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                <EMARComponent user={user} />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="ScheduleTemplate" asChild>
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                                className="min-h-[400px]"
                            >
                                <ScheduleTemplate user={user} />
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>

            {/* Debug Panel */}
            {user && (
                <Collapsible className="mt-8 border rounded-md">
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium">
                        <div className="flex items-center">
                            <Code className="mr-2 h-4 w-4" />
                            Debug: User Data
                        </div>
                        <span className="text-xs text-muted-foreground">Click to expand</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-4 bg-muted/50 rounded-b-md overflow-auto max-h-[500px]">
                            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    )
}

export default EditUserPage
