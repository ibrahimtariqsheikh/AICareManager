"use client"

import { motion, MotionStyle } from "framer-motion"
import { cn } from "@/lib/utils"
import { eventTypeStyles, EventStyles } from "../styles/event-colors"
import { Home, Video, Building2, Phone, User, Calendar } from "lucide-react"
import type { AppointmentEvent } from "../types"

interface CalendarEventCardProps {
    event: AppointmentEvent
    isActive?: boolean
    isHovered?: boolean
    isDragging?: boolean
    spaceTheme?: boolean
    onClick?: (event: AppointmentEvent) => void
    onDragStart?: (event: AppointmentEvent) => void
    onDrag?: (event: AppointmentEvent, info: any) => void
    onDragEnd?: (event: AppointmentEvent, info: any) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    className?: string
    style?: MotionStyle
}

type LeaveType = 'annual_leave' | 'sick_leave' | 'public_holiday' | 'unpaid_leave' | 'maternity_leave' | 'paternity_leave' | 'bereavement_leave' | 'emergency_leave' | 'medical_appointment' | 'toil' | 'default';

type LeaveStyle = {
    bg: string;
    hoverBg: string;
    activeBg: string;
};

type LeaveStyles = Record<LeaveType, LeaveStyle>;

type LeaveTextStyle = Record<LeaveType, string>;

export function CalendarEventCard({
    event,
    isActive = false,
    isHovered = false,
    isDragging = false,
    spaceTheme = false,
    onClick,
    onDragStart,
    onDrag,
    onDragEnd,
    onMouseEnter,
    onMouseLeave,
    className,
    style,
}: CalendarEventCardProps) {
    // Get event styling based on type
    const getEventBackground = (event: AppointmentEvent, isActive = false, isHovered = false) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: LeaveStyles = {
                annual_leave: {
                    bg: 'bg-green-50',
                    hoverBg: 'bg-green-100',
                    activeBg: 'bg-green-200'
                },
                sick_leave: {
                    bg: 'bg-red-50',
                    hoverBg: 'bg-red-100',
                    activeBg: 'bg-red-200'
                },
                public_holiday: {
                    bg: 'bg-blue-50',
                    hoverBg: 'bg-blue-100',
                    activeBg: 'bg-blue-200'
                },
                unpaid_leave: {
                    bg: 'bg-gray-50',
                    hoverBg: 'bg-gray-100',
                    activeBg: 'bg-gray-200'
                },
                maternity_leave: {
                    bg: 'bg-pink-50',
                    hoverBg: 'bg-pink-100',
                    activeBg: 'bg-pink-200'
                },
                paternity_leave: {
                    bg: 'bg-purple-50',
                    hoverBg: 'bg-purple-100',
                    activeBg: 'bg-purple-200'
                },
                bereavement_leave: {
                    bg: 'bg-brown-50',
                    hoverBg: 'bg-brown-100',
                    activeBg: 'bg-brown-200'
                },
                emergency_leave: {
                    bg: 'bg-orange-50',
                    hoverBg: 'bg-orange-100',
                    activeBg: 'bg-orange-200'
                },
                medical_appointment: {
                    bg: 'bg-cyan-50',
                    hoverBg: 'bg-cyan-100',
                    activeBg: 'bg-cyan-200'
                },
                toil: {
                    bg: 'bg-amber-50',
                    hoverBg: 'bg-amber-100',
                    activeBg: 'bg-amber-200'
                },
                default: {
                    bg: 'bg-gray-50',
                    hoverBg: 'bg-gray-100',
                    activeBg: 'bg-gray-200'
                }
            };
            const style = styles[leaveType];
            if (spaceTheme) {
                const bgColor = style.bg.replace('bg-', 'bg-').replace('-50', '-900/30');
                const hoverColor = style.hoverBg.replace('bg-', 'bg-').replace('-100', '-900/40');
                const activeColor = style.activeBg.replace('bg-', 'bg-').replace('-200', '-900/60');
                return isActive ? activeColor : isHovered ? hoverColor : bgColor;
            }
            return isActive ? style.activeBg : isHovered ? style.hoverBg : style.bg;
        }

        const type = event.type.toLowerCase();
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles;

        if (spaceTheme) {
            const bgColor = styles.bg.replace('bg-', 'bg-').replace('-50', '-900/30');
            const hoverColor = styles.hoverBg.replace('bg-', 'bg-').replace('-100', '-900/40');
            const activeColor = styles.activeBg.replace('bg-', 'bg-').replace('-200', '-900/60');
            return isActive ? activeColor : isHovered ? hoverColor : bgColor;
        } else {
            return isActive ? styles.activeBg : isHovered ? styles.hoverBg : styles.bg;
        }
    }

    const getEventBorderColor = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: LeaveTextStyle = {
                annual_leave: 'border-green-200',
                sick_leave: 'border-red-200',
                public_holiday: 'border-blue-200',
                unpaid_leave: 'border-gray-200',
                maternity_leave: 'border-pink-200',
                paternity_leave: 'border-purple-200',
                bereavement_leave: 'border-brown-200',
                emergency_leave: 'border-orange-200',
                medical_appointment: 'border-cyan-200',
                toil: 'border-amber-200',
                default: 'border-gray-200'
            };
            return styles[leaveType];
        }

        const type = event.type.toLowerCase();
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles;
        return styles.border;
    }

    const getEventTextColor = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: LeaveTextStyle = {
                annual_leave: 'text-green-700',
                sick_leave: 'text-red-700',
                public_holiday: 'text-blue-700',
                unpaid_leave: 'text-gray-700',
                maternity_leave: 'text-pink-700',
                paternity_leave: 'text-purple-700',
                bereavement_leave: 'text-brown-700',
                emergency_leave: 'text-orange-700',
                medical_appointment: 'text-cyan-700',
                toil: 'text-amber-700',
                default: 'text-gray-700'
            };
            return styles[leaveType];
        }

        const type = event.type.toLowerCase();
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles;
        return styles.text;
    }

    const getEventMutedTextColor = (event: AppointmentEvent) => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: LeaveTextStyle = {
                annual_leave: 'text-green-500',
                sick_leave: 'text-red-500',
                public_holiday: 'text-blue-500',
                unpaid_leave: 'text-gray-500',
                maternity_leave: 'text-pink-500',
                paternity_leave: 'text-purple-500',
                bereavement_leave: 'text-brown-500',
                emergency_leave: 'text-orange-500',
                medical_appointment: 'text-cyan-500',
                toil: 'text-amber-500',
                default: 'text-gray-500'
            };
            return styles[leaveType];
        }

        const type = event.type.toLowerCase();
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles;
        return styles.mutedText;
    }

    // Get event icon based on type
    const getEventIcon = (type: string) => {

        switch (type) {

            case "HOME_VISIT":
                return <Home className="h-3.5 w-3.5" />
            case "VIDEO_CALL":
                return <Video className="h-3.5 w-3.5" />
            case "HOSPITAL":
                return <Building2 className="h-3.5 w-3.5" />
            case "AUDIO_CALL":
                return <Phone className="h-3.5 w-3.5" />
            case "IN_PERSON":
                return <User className="h-3.5 w-3.5" />
            default:
                return <Calendar className="h-3.5 w-3.5" />
        }
    }

    return (
        <motion.div
            className={cn(
                "rounded-md border p-2 cursor-pointer transition-colors",
                isDragging
                    ? (spaceTheme ? "shadow-lg shadow-black/50" : "shadow-lg shadow-black/20")
                    : (spaceTheme ? "shadow-md shadow-black/30" : "shadow-sm shadow-black/10"),
                getEventBackground(event, isActive, isHovered),
                getEventBorderColor(event),
                spaceTheme ? "border-slate-700" : "",
                className
            )}
            animate={{
                scale: isDragging ? 1.02 : 1,
                opacity: isDragging ? 0.9 : 1,
            }}
            transition={{
                duration: 0.2,
                ease: "easeInOut"
            }}
            drag={onDragStart ? "x" : false}
            dragSnapToOrigin
            onDragStart={() => onDragStart?.(event)}
            onDrag={(_, info) => onDrag?.(event, info)}
            onDragEnd={(_, info) => onDragEnd?.(event, info)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick?.(event)}
            whileDrag={{ scale: 1.05 }}
            {...(style && { style })}
        >
            <div className={cn("flex items-center gap-1 mb-1", getEventTextColor(event))}>
                {getEventIcon(event.type)}
                <span className="font-medium truncate">{event.title}</span>
            </div>
            <div className={cn("text-[10px]", getEventMutedTextColor(event))}>
                {new Date(event.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
        </motion.div>
    )
} 