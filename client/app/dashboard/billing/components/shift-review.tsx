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
import { AlertCircle, CheckCircle2, Clock, Edit, Sparkles } from "lucide-react"

interface ShiftReviewProps {
    date: DateRange | undefined
}

export function ShiftReview({ }: ShiftReviewProps) {
    const [activeTab, setActiveTab] = useState("pending")

    // Mock data for shifts
    const pendingShifts = [
        {
            id: "shift-1",
            careWorker: {
                name: "Lian Huang",
                avatar: "/placeholder.svg?height=40&width=40",
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
                avatar: "/placeholder.svg?height=40&width=40",
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
                avatar: "/placeholder.svg?height=40&width=40",
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

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Clock className="h-6 w-6 text-primary" />
                        Accelerate billing and payroll with automatic shift review
                    </CardTitle>
                    <CardDescription>
                        Shifts with exceptions are flagged for review with an AI-generated summary. Shifts without exceptions are
                        automatically finalized and added to invoices and payroll.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="pending" className="flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                <span>Pending Review</span>
                                <Badge variant="secondary" className="ml-1">
                                    {pendingShifts.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="approved" className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Approved</span>
                                <Badge variant="secondary" className="ml-1">
                                    {approvedShifts.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="space-y-4">
                            {pendingShifts.map((shift) => (
                                <Card key={shift.id} className={shift.exceptions.length > 0 ? "border-yellow-200" : ""}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Checkbox id={`select-${shift.id}`} />
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={shift.careWorker.avatar || "/placeholder.svg"}
                                                        alt={shift.careWorker.name}
                                                    />
                                                    <AvatarFallback>{shift.careWorker.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{shift.careWorker.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {shift.date}, {shift.timeRange} ({shift.supervisor})
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {shift.exceptions.length > 0 && shift.exceptions[0] && getExceptionBadge(shift.exceptions[0].severity)}
                                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                    <Edit className="h-4 w-4" />
                                                    <span>Edit Shift</span>
                                                </Button>
                                                <Button size="sm" className="flex items-center gap-1">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>Approve</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {shift.shifts.map((subShift) => (
                                                    <div
                                                        key={subShift.id}
                                                        className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {subShift.type}: {subShift.timeRange}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">Rate: ${subShift.rate.toFixed(2)}/hr</div>
                                                        </div>
                                                        <Checkbox id={`approve-${subShift.id}`} />
                                                    </div>
                                                ))}
                                            </div>

                                            {shift.exceptions.length > 0 && shift.exceptions[0] && (
                                                <div className="mt-4 p-4 border rounded-md bg-yellow-50 border-yellow-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="font-medium text-yellow-800 flex items-center gap-2">
                                                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                            {shift.exceptions[0].type}
                                                        </div>
                                                        <div className="text-sm text-yellow-700">
                                                            Identified by {shift.exceptions[0].detectedBy} at {shift.exceptions[0].detectedAt}
                                                        </div>
                                                    </div>
                                                    <p className="text-yellow-800">{shift.exceptions[0].description}</p>

                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <Button variant="outline" size="sm">
                                                            Edit Shift
                                                        </Button>
                                                        <Button size="sm" className="flex items-center gap-1">
                                                            <Sparkles className="h-4 w-4" />
                                                            AI Resolve
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="flex justify-between items-center">
                                <Button variant="outline" className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve Selected
                                </Button>
                                <Button className="flex items-center gap-1">
                                    <Sparkles className="h-4 w-4" />
                                    AI Resolve All Exceptions
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="approved" className="space-y-4">
                            {approvedShifts.map((shift) => (
                                <Card key={shift.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={shift.careWorker.avatar || "/placeholder.svg"}
                                                        alt={shift.careWorker.name}
                                                    />
                                                    <AvatarFallback>{shift.careWorker.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{shift.careWorker.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {shift.date}, {shift.timeRange} ({shift.supervisor})
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Approved
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {shift.shifts.map((subShift) => (
                                                    <div
                                                        key={subShift.id}
                                                        className="flex justify-between items-center p-3 bg-muted/30 rounded-md"
                                                    >
                                                        <div>
                                                            <div className="font-medium">
                                                                {subShift.type}: {subShift.timeRange}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">Rate: ${subShift.rate.toFixed(2)}/hr</div>
                                                        </div>
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-sm text-muted-foreground text-right">
                                                Approved by {shift.approvedBy} at {shift.approvedAt}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Shift Resolution
                    </CardTitle>
                    <CardDescription>
                        Correct billing or payroll issues easily. Use our AI assistant to adjust shifts with text or voice commands.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Ask AI to fix shift issues..." className="flex-1" />
                        <Button className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Ask AI
                        </Button>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>Example commands:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>&quot;Fix the travel time exception for Lian Huang on March 30&quot;</li>
                            <li>&quot;Adjust Richard Brief&apos;s shift on March 29 to start at 10:15 AM&quot;</li>
                            <li>&quot;Add a 30-minute break to all shifts longer than 6 hours&quot;</li>
                            <li>&quot;Show me all shifts with overtime in the last week&quot;</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
