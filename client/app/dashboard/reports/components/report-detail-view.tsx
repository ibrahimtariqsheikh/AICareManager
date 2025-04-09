"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import {
    AlertCircle,
    Calendar,
    Check,
    Clock,
    Edit,
    FileText,
    MapPin,
    Pill,
    Sparkles,
    User,
    Users,
    Utensils,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Import motion components at the top of the file
import { motion } from "framer-motion"

interface ReportDetailViewProps {
    report: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit: () => void
    onAIImprove: () => void
}

export function ReportDetailView({ report, open, onOpenChange, onEdit, onAIImprove }: ReportDetailViewProps) {
    // Get task icon component
    const getTaskIcon = (iconName: string) => {
        switch (iconName) {
            case "pill":
                return <Pill className="h-4 w-4" />
            case "utensils":
                return <Utensils className="h-4 w-4" />
            case "users":
                return <Users className="h-4 w-4" />
            case "user":
                return <User className="h-4 w-4" />
            case "coffee":
                return <div className="h-4 w-4">☕</div>
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <DialogHeader>
                        <DialogTitle>Visit Report Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Client and Care Worker Info */}
                        <motion.div
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Client</span>
                                    <span className="font-medium">{report.clientName}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={report.careWorkerAvatar} alt={report.careWorkerName} />
                                    <AvatarFallback>{report.careWorkerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Care Worker</span>
                                    <span className="font-medium">{report.careWorkerName}</span>
                                </div>
                            </div>
                        </motion.div>

                        <Separator />

                        {/* Visit Details */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Date:</span>
                                    <span className="text-sm">{format(new Date(report.date), "EEEE, MMMM d, yyyy")}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Check-in:</span>
                                    <span className="text-sm">{report.checkInTime}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Check-out:</span>
                                    <span className="text-sm">{report.checkOutTime}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Duration:</span>
                                    <span className="text-sm">{report.duration}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {report.location && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Check-in location:</span>
                                            <span className="text-sm">{report.location.checkIn}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Check-out location:</span>
                                            <span className="text-sm">{report.location.checkOut}</span>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Client signature:</span>
                                    <span className="text-sm">{report.hasSignature ? "Obtained" : "Not obtained"}</span>
                                </div>
                            </div>
                        </motion.div>

                        <Separator />

                        {/* Tasks */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
                            <h3 className="text-sm font-medium mb-3">Tasks Completed</h3>
                            <div className="flex flex-wrap gap-2">
                                {report.tasks.map((task: any, index: number) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2, delay: 0.1 * index }}
                                    >
                                        <Badge variant="secondary" className="flex items-center">
                                            {getTaskIcon(task.icon)}
                                            <span className="ml-1">{task.name}</span>
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Notes */}
                        {report.notes && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
                                <h3 className="text-sm font-medium mb-2">Notes</h3>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-sm">{report.notes}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Alerts */}
                        {report.alerts && report.alerts.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
                                <h3 className="text-sm font-medium mb-2">Alerts</h3>
                                <div className="space-y-2">
                                    {report.alerts.map((alert: any, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                        >
                                            <Card className={alert.severity === "high" ? "border-red-500" : ""}>
                                                <CardContent className="p-4 flex items-start gap-2">
                                                    <AlertCircle
                                                        className={`h-5 w-5 flex-shrink-0 ${alert.severity === "high"
                                                                ? "text-red-500"
                                                                : alert.severity === "medium"
                                                                    ? "text-amber-500"
                                                                    : "text-blue-500"
                                                            }`}
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                                                        </p>
                                                        <p className="text-sm">{alert.message}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Body Map */}
                        {report.bodyMap && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Body Map</h3>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex justify-center">
                                                    <div className="relative w-48 h-64 bg-gray-100 rounded-md">
                                                        {/* Simple body outline */}
                                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                            Body Map Visualization
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Recorded Areas</h4>
                                                    <ul className="space-y-2">
                                                        {report.bodyMap.areas.map((area: any, index: number) => (
                                                            <li key={index} className="text-sm">
                                                                <span className="font-medium">{area.part}:</span> {area.condition}
                                                                {area.notes && <p className="text-muted-foreground mt-1">{area.notes}</p>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                        <div className="flex gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" onClick={onAIImprove}>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    AI Improve
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button onClick={onEdit}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Report
                                </Button>
                            </motion.div>
                        </div>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
