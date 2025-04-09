"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useUpdateReportMutation, useGetAgencyUsersQuery } from "@/state/api"
import { User } from "@/types/userTypes"

interface ReportEditDialogProps {
    report: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ReportEditDialog({ report, open, onOpenChange, onSuccess }: ReportEditDialogProps) {
    const [editedReport, setEditedReport] = useState({ ...report })
    const [editReason, setEditReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [updateReport] = useUpdateReportMutation()
    const { data: agencyUsersResponse } = useGetAgencyUsersQuery(report.agencyId)
    const agencyUsers: User[] = (agencyUsersResponse?.data || []) as User[]

    const handleSave = async () => {
        if (!editReason) {
            toast.error("Please provide a reason for editing this report")
            return
        }

        setIsSubmitting(true)

        try {
            const { id, ...updateData } = editedReport
            await updateReport({ id, data: updateData }).unwrap()

            toast.success("Report updated successfully")
            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            console.error("Error updating report:", error)
            toast.error("Failed to update report. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setEditedReport({ ...report })
        setEditReason("")
        onOpenChange(false)
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]
            setEditedReport({
                ...editedReport,
                checkInTime: `${formattedDate}T${new Date(editedReport.checkInTime).toTimeString().split(' ')[0]}`
            })
        }
    }

    const handleTimeChange = (time: string, field: 'checkInTime' | 'checkOutTime') => {
        const date = new Date(editedReport[field])
        const [hours, minutes] = time.split(':')
        date.setHours(parseInt(hours))
        date.setMinutes(parseInt(minutes))
        setEditedReport({
            ...editedReport,
            [field]: date.toISOString()
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Report</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="edit-reason" className="text-red-500">
                            Reason for Edit (Required for Compliance)
                        </Label>
                        <Textarea
                            id="edit-reason"
                            placeholder="Please provide a reason for editing this report..."
                            value={editReason}
                            onChange={(e) => setEditReason(e.target.value)}
                            className="min-h-[80px]"
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(new Date(editedReport.checkInTime), "PPP")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(editedReport.checkInTime)}
                                        onSelect={handleDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Time</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="check-in-time" className="text-xs">Check-in</Label>
                                    <Input
                                        id="check-in-time"
                                        type="time"
                                        value={new Date(editedReport.checkInTime).toTimeString().slice(0, 5)}
                                        onChange={(e) => handleTimeChange(e.target.value, 'checkInTime')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="check-out-time" className="text-xs">Check-out</Label>
                                    <Input
                                        id="check-out-time"
                                        type="time"
                                        value={editedReport.checkOutTime ? new Date(editedReport.checkOutTime).toTimeString().slice(0, 5) : ""}
                                        onChange={(e) => handleTimeChange(e.target.value, 'checkOutTime')}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className="space-y-2">
                            <Label>Care Worker</Label>
                            <Select
                                value={editedReport.userId}
                                onValueChange={(value) => setEditedReport({ ...editedReport, userId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select care worker" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agencyUsers
                                        .filter((user: User) => user.role === 'CARE_WORKER')
                                        .map((user: User) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Client</Label>
                            <Select
                                value={editedReport.clientId}
                                onValueChange={(value) => setEditedReport({ ...editedReport, clientId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agencyUsers
                                        .filter((user: User) => user.role === 'CLIENT')
                                        .map((user: User) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="condition">Condition</Label>
                        <Select
                            value={editedReport.condition}
                            onValueChange={(value) => setEditedReport({ ...editedReport, condition: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Good">Good</SelectItem>
                                <SelectItem value="Fair">Fair</SelectItem>
                                <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                        </Select>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                            id="summary"
                            placeholder="Enter visit summary..."
                            value={editedReport.summary}
                            onChange={(e) => setEditedReport({ ...editedReport, summary: e.target.value })}
                            className="min-h-[120px]"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label>Tasks Completed</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {editedReport.tasksCompleted?.map((task: any, index: number) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 * index }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`task-${task.id}`}
                                            checked={task.completed}
                                            onCheckedChange={(checked) => {
                                                const updatedTasks = [...(editedReport.tasksCompleted || [])];
                                                updatedTasks[index] = {
                                                    ...task,
                                                    completed: checked === true
                                                };
                                                setEditedReport({
                                                    ...editedReport,
                                                    tasksCompleted: updatedTasks
                                                });
                                            }}
                                        />
                                        <Label htmlFor={`task-${task.id}`} className="text-sm">
                                            {task.taskName}
                                        </Label>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {editedReport.alerts && editedReport.alerts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="space-y-2"
                        >
                            <Label>Alerts</Label>
                            <AnimatePresence>
                                {editedReport.alerts.map((alert: any, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-2 border p-3 rounded-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`alert-type-${index}`}>Alert Type</Label>
                                            <Select
                                                value={alert.type}
                                                onValueChange={(value) => {
                                                    const updatedAlerts = [...editedReport.alerts]
                                                    updatedAlerts[index].type = value
                                                    setEditedReport({ ...editedReport, alerts: updatedAlerts })
                                                }}
                                            >
                                                <SelectTrigger id={`alert-type-${index}`} className="w-[180px]">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="medication">Medication</SelectItem>
                                                    <SelectItem value="incident">Incident</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`alert-message-${index}`}>Alert Message</Label>
                                            <Textarea
                                                id={`alert-message-${index}`}
                                                value={alert.message}
                                                onChange={(e) => {
                                                    const updatedAlerts = [...editedReport.alerts]
                                                    updatedAlerts[index].message = e.target.value
                                                    setEditedReport({ ...editedReport, alerts: updatedAlerts })
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`alert-severity-${index}`}>Severity</Label>
                                            <Select
                                                value={alert.severity}
                                                onValueChange={(value) => {
                                                    const updatedAlerts = [...editedReport.alerts]
                                                    updatedAlerts[index].severity = value
                                                    setEditedReport({ ...editedReport, alerts: updatedAlerts })
                                                }}
                                            >
                                                <SelectTrigger id={`alert-severity-${index}`} className="w-[180px]">
                                                    <SelectValue placeholder="Select severity" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            id="has-signature"
                            checked={editedReport.hasSignature}
                            onCheckedChange={(checked) => setEditedReport({ ...editedReport, hasSignature: checked === true })}
                        />
                        <Label htmlFor="has-signature">Client Signature Obtained</Label>
                    </motion.div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={handleSave} disabled={isSubmitting || !editReason}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </motion.div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
