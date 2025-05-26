"use client"

import { Input } from "@/components/ui/input"
import { DateRange } from "react-day-picker"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Clock, Edit, Sparkles, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { ShiftReviewActions } from "./shift-review-actions"

interface ShiftReviewProps {
    date: DateRange | undefined
}

export function ShiftReview({ date }: ShiftReviewProps) {
    const [activeTab, setActiveTab] = useState("pending")
    const [showFilters, setShowFilters] = useState(false)
    const [sortField, setSortField] = useState<string>("careWorker")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [showAIResolve, setShowAIResolve] = useState(false)

    // Mock data for shifts
    const pendingShifts = [
        {
            id: "shift-1",
            careWorker: {
                name: "Lian Huang",
                avatar: getRandomPlaceholderImage(),
            },
            date: "Fri, Mar 29",
            timeRange: "8AM - 5PM EST",
            supervisor: "S. Chen",
            shifts: [
                { id: "s1", type: "Regular", timeRange: "8:00AM - 5:00PM", rate: 42.0 },
                { id: "s2", type: "Overtime", timeRange: "5:00PM - 7:00PM", rate: 64.0 },
            ],
            exceptions: [],
        },
        {
            id: "shift-2",
            careWorker: {
                name: "Lian Huang",
                avatar: getRandomPlaceholderImage(),
            },
            date: "Sat, Mar 30",
            timeRange: "9AM - 3PM EST",
            supervisor: "S. Chen",
            shifts: [{ id: "s3", type: "Regular", timeRange: "9:00AM - 3:00PM", rate: 42.0 }],
            exceptions: [
                {
                    id: "e1",
                    type: "Blocking Exception",
                    description: "Abnormal Travel Time: Time spent traveling between shifts exceeded 30 minutes.",
                    severity: "high",
                    detectedBy: "Looper AI",
                    detectedAt: "2:31 PM",
                },
            ],
        },
        {
            id: "shift-3",
            careWorker: {
                name: "Richard Brief",
                avatar: getRandomPlaceholderImage(),
            },
            date: "Fri, Mar 29",
            timeRange: "10AM - 6PM EST",
            supervisor: "M. Johnson",
            shifts: [{ id: "s4", type: "Regular", timeRange: "10:00AM - 6:00PM", rate: 38.0 }],
            exceptions: [
                {
                    id: "e2",
                    type: "Warning Exception",
                    description: "Shift started 15 minutes later than scheduled.",
                    severity: "medium",
                    detectedBy: "Looper AI",
                    detectedAt: "10:16 AM",
                },
            ],
        },
    ]

    const approvedShifts = [
        {
            id: "shift-4",
            careWorker: {
                name: "Sophia Gutkowski",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            date: "Thu, Mar 28",
            timeRange: "9AM - 5PM EST",
            supervisor: "J. Wilson",
            shifts: [{ id: "s5", type: "Regular", timeRange: "9:00AM - 5:00PM", rate: 40.0 }],
            approvedBy: "J. Wilson",
            approvedAt: "Mar 28, 5:15 PM",
        },
        {
            id: "shift-5",
            careWorker: {
                name: "Dejah Donnelly",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            date: "Thu, Mar 28",
            timeRange: "2PM - 8PM EST",
            supervisor: "S. Chen",
            shifts: [{ id: "s6", type: "Regular", timeRange: "2:00PM - 8:00PM", rate: 42.0 }],
            approvedBy: "S. Chen",
            approvedAt: "Mar 28, 8:30 PM",
        },
    ]

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
                            {pendingShifts.map((shift) => (
                                <TableRow key={shift.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                    <TableCell className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={shift.careWorker.avatar} alt={shift.careWorker.name} />
                                                <AvatarFallback>{shift.careWorker.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{shift.careWorker.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="font-medium">{shift.date}</div>
                                        <div className="text-sm text-muted-foreground">{shift.timeRange}</div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">{shift.supervisor}</TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="space-y-1">
                                            {shift.shifts.map((subShift) => (
                                                <div key={subShift.id} className="text-sm">
                                                    <span className="font-medium">{subShift.type}:</span> {subShift.timeRange}
                                                    <span className="text-muted-foreground ml-2">${subShift.rate}/hr</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        {shift.exceptions.length > 0 ? (
                                            <div className="space-y-1">
                                                {shift.exceptions.map((exception) => (
                                                    <div key={exception.id} className="flex items-center gap-2">
                                                        {getExceptionBadge(exception.severity)}
                                                        <span className="text-xs text-muted-foreground">
                                                            {exception.detectedAt}
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
                            {approvedShifts.map((shift) => (
                                <TableRow key={shift.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                                    <TableCell className="py-2 px-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={shift.careWorker.avatar} alt={shift.careWorker.name} />
                                                <AvatarFallback>{shift.careWorker.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{shift.careWorker.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="font-medium">{shift.date}</div>
                                        <div className="text-sm text-muted-foreground">{shift.timeRange}</div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">{shift.supervisor}</TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="space-y-1">
                                            {shift.shifts.map((subShift) => (
                                                <div key={subShift.id} className="text-sm">
                                                    <span className="font-medium">{subShift.type}:</span> {subShift.timeRange}
                                                    <span className="text-muted-foreground ml-2">${subShift.rate}/hr</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2 px-3">
                                        <div className="text-sm">
                                            <div className="font-medium">{shift.approvedBy}</div>
                                            <div className="text-muted-foreground">{shift.approvedAt}</div>
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
