"use client"

import { Input } from "@/components/ui/input"
import { DateRange } from "react-day-picker"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Edit, Sparkles, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { ShiftReviewActions } from "./shift-review-actions"
import { useGetAgencyShiftReviewsQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { RootState } from "@/state/redux"
import type { ShiftReview } from "@/types/prismaTypes"

interface ShiftReviewProps {
    date: DateRange | undefined
}

export function ShiftReview({ date }: ShiftReviewProps) {
    const [activeTab, setActiveTab] = useState("pending")
    const [showFilters, setShowFilters] = useState(false)
    const [sortField, setSortField] = useState<string>("careWorker")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [showAIResolve, setShowAIResolve] = useState(false)

    const agencyId = useAppSelector((state: RootState) => state.user.user.userInfo?.agencyId ?? '');
    const { data: shiftReviews, isLoading } = useGetAgencyShiftReviewsQuery(agencyId, {
        skip: !agencyId
    });



    const pendingShifts = (shiftReviews || []).filter((review: any) => review.status === "PENDING");
    const approvedShifts = (shiftReviews || []).filter((review: any) => review.status === "APPROVED");

    const getExceptionBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Blocking Exception
                    </Badge>
                )
            case "medium":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Warning Exception
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Info Exception
                    </Badge>
                )
            default:
                return <Badge variant="outline">Exception</Badge>
        }
    }

    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    return (
        <div className="space-y-6">
            <ShiftReviewActions
                showFilters={showFilters}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                pendingCount={pendingShifts.length}
                approvedCount={approvedShifts.length}
            />

            {activeTab === "pending" && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border bg-muted/50">
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("careWorker")}>
                                    <div className="flex items-center">
                                        Care Worker
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("date")}>
                                    <div className="flex items-center">
                                        Date & Time
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("supervisor")}>
                                    <div className="flex items-center">
                                        Supervisor
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Shifts</TableHead>
                                <TableHead className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Exceptions</TableHead>
                                <TableHead className="w-24 py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingShifts.map((shift: ShiftReview) => (
                                <TableRow key={shift.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                    <TableCell className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={shift.careWorker?.avatar || getRandomPlaceholderImage()} alt={shift.careWorker?.fullName || "Care Worker"} />
                                                <AvatarFallback>{shift.careWorker?.fullName?.charAt(0) || "?"}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{shift.careWorker?.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="font-medium">{shift.shiftDate ? new Date(shift.shiftDate).toLocaleDateString() : "-"}</div>
                                        <div className="text-sm text-muted-foreground">{shift.startTime} - {shift.endTime}</div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">{shift.supervisor?.fullName}</TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="space-y-1">
                                            <div className="text-sm">
                                                <span className="font-medium">{shift.shiftType}:</span> {shift.startTime} - {shift.endTime}
                                                <span className="text-muted-foreground ml-2">${shift.hourlyRate}/hr</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        {shift.exceptions && shift.exceptions.length > 0 ? (
                                            <div className="space-y-1">
                                                {shift.exceptions.map((exception: any) => (
                                                    <div key={exception.id} className="flex items-center gap-2">
                                                        {getExceptionBadge(exception.severity?.toLowerCase())}
                                                        <span className="text-xs text-muted-foreground">
                                                            {exception.detectedAt ? new Date(exception.detectedAt).toLocaleString() : ""}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                No Exceptions
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {activeTab === "approved" && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border bg-muted/50">
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("careWorker")}>
                                    <div className="flex items-center">
                                        Care Worker
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("date")}>
                                    <div className="flex items-center">
                                        Date & Time
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider" onClick={() => handleSort("supervisor")}>
                                    <div className="flex items-center">
                                        Supervisor
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Shifts</TableHead>
                                <TableHead className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvedShifts.map((shift: ShiftReview) => (
                                <TableRow key={shift.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                    <TableCell className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={shift.careWorker?.avatar || getRandomPlaceholderImage()} alt={shift.careWorker?.fullName || "Care Worker"} />
                                                <AvatarFallback>{shift.careWorker?.fullName?.charAt(0) || "?"}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{shift.careWorker?.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="font-medium">{shift.shiftDate ? new Date(shift.shiftDate).toLocaleDateString() : "-"}</div>
                                        <div className="text-sm text-muted-foreground">{shift.startTime} - {shift.endTime}</div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">{shift.supervisor?.fullName}</TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="space-y-1">
                                            <div className="text-sm">
                                                <span className="font-medium">{shift.shiftType}:</span> {shift.startTime} - {shift.endTime}
                                                <span className="text-muted-foreground ml-2">${shift.hourlyRate}/hr</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="text-sm">
                                            <div className="font-medium">{shift.approvedBy?.fullName}</div>
                                            <div className="text-muted-foreground">{shift.approvedAt ? new Date(shift.approvedAt).toLocaleString() : ""}</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AnimatePresence>
                {showAIResolve && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 p-4 bg-muted/50 rounded-md space-y-4"
                    >
                        <div className="flex items-center gap-2">
                            <Input placeholder="Ask AI to fix shift issues..." className="flex-1" />
                            <Button className="flex items-center gap-1">
                                <Sparkles className="h-4 w-4" />
                                Ask AI
                            </Button>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <p>Example commands:</p>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>&quot;Fix the travel time exception for Lian Huang on March 30&quot;</li>
                                <li>&quot;Adjust Richard Brief&apos;s shift on March 29 to start at 10:15 AM&quot;</li>
                                <li>&quot;Add a 30-minute break to all shifts longer than 6 hours&quot;</li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
