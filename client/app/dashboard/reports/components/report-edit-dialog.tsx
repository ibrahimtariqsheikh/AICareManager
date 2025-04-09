"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Import motion components at the top of the file
import { motion, AnimatePresence } from "framer-motion"

interface ReportEditDialogProps {
    report: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ReportEditDialog({ report, open, onOpenChange }: ReportEditDialogProps) {
    const [editedReport, setEditedReport] = useState({ ...report })
    const [editReason, setEditReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSave = () => {
        if (!editReason) {
            toast.error("Please provide a reason for editing this report")
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            toast.success("Report updated successfully")
            setIsSubmitting(false)
            onOpenChange(false)
        }, 1000)
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
                            <Label htmlFor="check-in-time">Check-in Time</Label>
                            <Input
                                id="check-in-time"
                                type="time"
                                value={editedReport.checkInTime}
                                onChange={(e) => setEditedReport({ ...editedReport, checkInTime: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="check-out-time">Check-out Time</Label>
                            <Input
                                id="check-out-time"
                                type="time"
                                value={editedReport.checkOutTime}
                                onChange={(e) => setEditedReport({ ...editedReport, checkOutTime: e.target.value })}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Enter visit notes..."
                            value={editedReport.notes || ""}
                            onChange={(e) => setEditedReport({ ...editedReport, notes: e.target.value })}
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
                            {editedReport.tasks.map((task: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 * index }}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`task-${index}`}
                                        checked={task.completed}
                                        onCheckedChange={(checked) => {
                                            const updatedTasks = [...editedReport.tasks]
                                            updatedTasks[index].completed = checked === true
                                            setEditedReport({ ...editedReport, tasks: updatedTasks })
                                        }}
                                    />
                                    <Label htmlFor={`task-${index}`}>{task.name}</Label>
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
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
