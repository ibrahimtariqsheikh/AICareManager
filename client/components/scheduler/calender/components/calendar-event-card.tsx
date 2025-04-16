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
        const type = event.type.toLowerCase()
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles

        if (spaceTheme) {
            // Convert light theme colors to dark theme
            const bgColor = styles.bg.replace('bg-', 'bg-').replace('-50', '-900/30')
            const hoverColor = styles.hoverBg.replace('bg-', 'bg-').replace('-100', '-900/40')
            const activeColor = styles.activeBg.replace('bg-', 'bg-').replace('-200', '-900/60')
            return isActive ? activeColor : isHovered ? hoverColor : bgColor
        } else {
            return isActive ? styles.activeBg : isHovered ? styles.hoverBg : styles.bg
        }
    }

    const getEventBorderColor = (event: AppointmentEvent) => {
        const type = event.type.toLowerCase()
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles
        return styles.border
    }

    const getEventTextColor = (event: AppointmentEvent) => {
        const type = event.type.toLowerCase()
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles
        return styles.text
    }

    const getEventMutedTextColor = (event: AppointmentEvent) => {
        const type = event.type.toLowerCase()
        const styles = (eventTypeStyles[type] || eventTypeStyles.meeting) as EventStyles
        return styles.mutedText
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