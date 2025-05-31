"use client"

import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
    Loader2,
    AlertTriangle,
    Clock,
    User,
    FileText,
    Calendar,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Bell,
    CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ToolInvocation } from "ai"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useGetAgencyAlertsQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"

interface AlertsToolResult {
    month: string
    year: string
    status: string
}

type ExtendedToolInvocation = ToolInvocation & {
    result?: AlertsToolResult
}

interface Alert {
    id: string
    type: string
    description: string
    reportId: string
    clientId: string
    careworkerId: string
    agencyId: string
    resolvedById: string | null
    resolvedAt: string | null
    createdAt: string
    updatedAt: string
    client: {
        fullName: string
    }
    careworker: {
        fullName: string
    }
    report: {
        title: string
    }
}

export function AlertsTool(toolInvocation: ExtendedToolInvocation) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
    const { toast } = useToast()

    const user = useAppSelector((state) => state.user.user)
    const agencyId = user?.userInfo?.agencyId
    const { data: alerts, isLoading: isFetchingAlerts, error: fetchAlertsError, refetch: refetchAlerts } = useGetAgencyAlertsQuery(agencyId || "", {
        skip: !agencyId
    })

    useEffect(() => {
        let isMounted = true;

        if (toolInvocation.state === "result" && !isLoading && !hasLoaded && toolInvocation.result) {
            setIsLoading(true);

            if (isMounted) {
                setIsLoading(false);
                setHasLoaded(true);

                if (fetchAlertsError) {
                    setError("Failed to fetch alerts");
                    toast({
                        title: "Error",
                        description: "Failed to fetch alerts. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        }

        return () => {
            isMounted = false;
        };
    }, [toolInvocation.state, toolInvocation.result, isLoading, hasLoaded, fetchAlertsError, toast]);

    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const alertTime = new Date(dateString)
        const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60))

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`
        }
    }


    const spring = {
        type: "spring",
        damping: 25,
        stiffness: 300,
        restDelta: 0.001
    }


    const alertTypeColors = {
        INCIDENT: {
            border: "rgb(239, 68, 68)", // red-500
            bg: "rgba(254, 226, 226, 0.15)" // red-50/15
        },
        ACCIDENT: {
            border: "rgb(220, 38, 38)", // red-600
            bg: "rgba(254, 226, 226, 0.15)" // red-50/15
        },
        MEDICATION: {
            border: "rgb(220, 38, 38)", // red-600
            bg: "rgba(254, 226, 226, 0.15)" // red-50/15
        },
        LATE_VISIT: {
            border: "rgb(234, 179, 8)", // yellow-500
            bg: "rgba(254, 249, 195, 0.15)" // yellow-50/15
        },
        LOCATION: {
            border: "rgb(234, 179, 8)", // yellow-500
            bg: "rgba(254, 249, 195, 0.15)" // yellow-50/15
        },
        HEALTH_CONCERN: {
            border: "rgb(239, 68, 68)", // red-500
            bg: "rgba(254, 226, 226, 0.15)" // red-50/15
        },
        SAFEGUARDING_CONCERN: {
            border: "rgb(234, 179, 8)", // yellow-500
            bg: "rgba(254, 249, 195, 0.15)" // yellow-50/15
        },
        CHALLENGING_BEHAVIOUR: {
            border: "rgb(245, 158, 11)", // orange-500
            bg: "rgba(255, 237, 213, 0.15)" // orange-50/15
        },
        OTHER: {
            border: "rgb(245, 158, 11)", // orange-500
            bg: "rgba(255, 237, 213, 0.15)" // orange-50/15
        }
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 8,
            scale: 0.98
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                ...spring,
                delay: i * 0.04,
                opacity: { duration: 0.2 }
            }
        }),
        exit: {
            opacity: 0,
            y: -8,
            scale: 0.98,
            transition: {
                duration: 0.15,
                ease: "easeOut"
            }
        }
    }

    const borderVariants = {
        active: (type: string) => ({
            borderColor: alertTypeColors[type as keyof typeof alertTypeColors]?.border || alertTypeColors.OTHER.border,
            backgroundColor: alertTypeColors[type as keyof typeof alertTypeColors]?.bg || alertTypeColors.OTHER.bg,
            transition: spring
        }),
        resolved: {
            borderColor: "rgb(34, 197, 94)", // green-500
            backgroundColor: "rgba(220, 252, 231, 0.15)", // green-50/15
            transition: spring
        }
    }

    // Fixed expand animation - using CSS transitions instead of Framer Motion height
    const expandVariants = {
        hidden: {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        visible: {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            transition: {
                duration: 0.3,
                ease: "easeOut",
                opacity: { duration: 0.25, delay: 0.1 }
            }
        },
        exit: {
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    }

    const chevronVariants = {
        up: {
            rotate: 180,
            transition: spring
        },
        down: {
            rotate: 0,
            transition: spring
        }
    }

    const formatAlertType = (type: string) => {
        return type
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const isAlertResolved = (alert: Alert) => {
        return alert.resolvedById !== null;
    };

    const handleResolve = async (alertId: string) => {
        try {
            // TODO: Add API call to resolve alert
            toast({
                title: "Alert Resolved",
                description: "The alert has been marked as resolved.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to resolve alert. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
                className="w-[320px]"
            >
                <Card className="bg-background p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                                <Loader2 className="h-3 w-3 text-neutral-500 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">Fetching alerts</div>
                            <div className="text-xs text-neutral-500">Loading data...</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="w-[320px]"
            >
                <Card className="bg-background p-3 rounded-lg shadow-sm border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <Bell className="h-3 w-3" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Error</div>
                            <div className="text-xs text-red-500">{error}</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (toolInvocation.state === "result") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={spring}
                className="w-full max-w-2xl"
            >
                <Card className="bg-background p-4 rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                    >
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <div className="font-medium">Alerts</div>
                            <div className="text-xs text-neutral-500">
                                {alerts?.length || 0} alert{alerts?.length !== 1 ? 's' : ''} requiring attention
                            </div>
                        </div>
                    </motion.div>

                    {/* No alerts message */}
                    {(!alerts || alerts.length === 0) && !isFetchingAlerts && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ ...spring, delay: 0.2 }}
                            className="text-center py-6"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="font-medium">No Active Alerts</div>
                            <div className="text-xs text-neutral-500">All alerts have been resolved</div>
                        </motion.div>
                    )}

                    {/* Alerts List */}
                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {(alerts as Alert[] | undefined)?.map((alert, index) => (
                                <motion.div
                                    key={alert.id}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                    className="relative"
                                >
                                    <motion.div
                                        variants={borderVariants}
                                        animate={isAlertResolved(alert) ? "resolved" : "active"}
                                        custom={alert.type}
                                        className="border-l-4 rounded-lg relative overflow-hidden"
                                        layout="position"
                                    >
                                        <Card
                                            className="p-3 cursor-pointer transition-colors hover:bg-muted/30 relative overflow-hidden border-0 rounded-l-none"
                                            onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                                        >
                                            {/* Main content - fixed layout */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                                            <span className="font-medium text-sm">{formatAlertType(alert.type)}</span>
                                                        </div>

                                                    </div>
                                                    <motion.div
                                                        variants={chevronVariants}
                                                        animate={expandedAlert === alert.id ? "up" : "down"}
                                                        className="flex-shrink-0"
                                                    >
                                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                                    </motion.div>
                                                </div>

                                                <p className="text-sm text-gray-700 mb-2 line-clamp-2 leading-relaxed">
                                                    {alert.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3 flex-shrink-0" />
                                                        <span className="font-medium">Client:</span>
                                                        <span className="truncate">{alert.client.fullName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3 flex-shrink-0" />
                                                        <span className="font-medium">Care Worker:</span>
                                                        <span className="truncate">{alert.careworker.fullName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 ml-auto">
                                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                                        {formatTimeAgo(alert.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable content - using CSS for smooth height transitions */}
                                            <div className={`overflow-hidden transition-all duration-300 ease-out ${expandedAlert === alert.id
                                                ? 'max-h-96 mt-2 pt-4 pb-2'
                                                : 'max-h-0 mt-0 pt-0 pb-0'
                                                }`}>
                                                <div className="border-t border-gray-200">
                                                    <AnimatePresence mode="wait">
                                                        {expandedAlert === alert.id && (
                                                            <motion.div
                                                                variants={expandVariants}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="exit"
                                                                className="pt-4"
                                                            >
                                                                <div className="space-y-4">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
                                                                                <FileText className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                                                <span className="font-medium text-gray-700">Report:</span>
                                                                            </div>
                                                                            <span className="text-gray-600 block pl-4">
                                                                                {alert.report.title}
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
                                                                                <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                                                <span className="font-medium text-gray-700">Created:</span>
                                                                            </div>
                                                                            <span className="text-gray-600 block pl-4">
                                                                                {new Date(alert.createdAt).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        {isAlertResolved(alert) && alert.resolvedAt && (
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center gap-1">
                                                                                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                                                    <span className="font-medium text-gray-700">Resolved:</span>
                                                                                </div>
                                                                                <span className="text-gray-600 block pl-4">
                                                                                    {new Date(alert.resolvedAt).toLocaleString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {!isAlertResolved(alert) && (
                                                                        <div className="flex justify-end pt-2">
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: 8 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: 0.2, duration: 0.25 }}
                                                                            >
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleResolve(alert.id);
                                                                                    }}
                                                                                >
                                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                                    Mark as Resolved
                                                                                </Button>
                                                                            </motion.div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        )
    }
}