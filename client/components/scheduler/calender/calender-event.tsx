"use client"

import moment from "moment"
import { Home, Video, Building2, Phone, User, Calendar, Heart, Flag, DollarSign, Baby, AlertTriangle, Stethoscope, Clock } from 'lucide-react'
import { type StaffMember } from "./types"
import { getStaffColor } from "./calender-utils"

interface CustomEventComponentProps {
    event: any
    staffMembers: StaffMember[]
    getEventDurationInMinutes: (event: any) => number
}

type LeaveType = 'annual_leave' | 'sick_leave' | 'public_holiday' | 'unpaid_leave' | 'maternity_leave' | 'paternity_leave' | 'bereavement_leave' | 'emergency_leave' | 'medical_appointment' | 'toil' | 'default';

type LeaveStyles = Record<LeaveType, string>;

export function CustomEventComponent({ event, staffMembers, getEventDurationInMinutes }: CustomEventComponentProps) {
    const durationMinutes = event.durationMinutes || getEventDurationInMinutes(event)
    const { staffColor, staffName } = getStaffColor(event, staffMembers)
    const timeRange = `${moment(event.start).format("h:mm a")} - ${moment(event.end).format("h:mm a")}`

    // Get event icon based on type
    const getEventIcon = () => {
        if (event.isLeaveEvent) {
            switch (event.leaveType) {
                case "ANNUAL_LEAVE":
                    return <Calendar className="h-3.5 w-3.5" />
                case "SICK_LEAVE":
                    return <Heart className="h-3.5 w-3.5" />
                case "PUBLIC_HOLIDAY":
                    return <Flag className="h-3.5 w-3.5" />
                case "UNPAID_LEAVE":
                    return <DollarSign className="h-3.5 w-3.5" />
                case "MATERNITY_LEAVE":
                    return <Baby className="h-3.5 w-3.5" />
                case "PATERNITY_LEAVE":
                    return <User className="h-3.5 w-3.5" />
                case "BEREAVEMENT_LEAVE":
                    return <Heart className="h-3.5 w-3.5" />
                case "EMERGENCY_LEAVE":
                    return <AlertTriangle className="h-3.5 w-3.5" />
                case "MEDICAL_APPOINTMENT":
                    return <Stethoscope className="h-3.5 w-3.5" />
                case "TOIL":
                    return <Clock className="h-3.5 w-3.5" />
                default:
                    return <Calendar className="h-3.5 w-3.5" />
            }
        }

        switch (event.type) {
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

    const iconComponent = getEventIcon()

    // Get event background color based on type
    const getEventBackground = () => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: LeaveStyles = {
                annual_leave: 'bg-green-50 hover:bg-green-100 active:bg-green-200',
                sick_leave: 'bg-red-50 hover:bg-red-100 active:bg-red-200',
                public_holiday: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200',
                unpaid_leave: 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200',
                maternity_leave: 'bg-pink-50 hover:bg-pink-100 active:bg-pink-200',
                paternity_leave: 'bg-purple-50 hover:bg-purple-100 active:bg-purple-200',
                bereavement_leave: 'bg-amber-50 hover:bg-amber-100 active:bg-amber-200',
                emergency_leave: 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200',
                medical_appointment: 'bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200',
                toil: 'bg-amber-50 hover:bg-amber-100 active:bg-amber-200',
                default: 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200'
            };
            return styles[leaveType];
        }

        switch (event.type) {
            case "HOME_VISIT":
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
            case "VIDEO_CALL":
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
            case "HOSPITAL":
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
            case "AUDIO_CALL":
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
            case "IN_PERSON":
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
            case "APPOINTMENT":
                return "bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
            default:
                return "bg-pink-50 hover:bg-pink-100 active:bg-pink-200"
        }
    }

    const getEventTextColor = () => {
        if (event.isLeaveEvent) {
            const leaveType = (event.leaveType?.toLowerCase() || 'default') as LeaveType;
            const styles: Record<LeaveType, string> = {
                annual_leave: 'text-green-700',
                sick_leave: 'text-red-700',
                public_holiday: 'text-blue-700',
                unpaid_leave: 'text-gray-700',
                maternity_leave: 'text-pink-700',
                paternity_leave: 'text-purple-700',
                bereavement_leave: 'text-amber-700',
                emergency_leave: 'text-orange-700',
                medical_appointment: 'text-cyan-700',
                toil: 'text-amber-700',
                default: 'text-gray-700'
            };
            return styles[leaveType];
        }

        switch (event.type) {
            case "APPOINTMENT":
                return "text-blue-700"
            default:
                return "text-pink-700"
        }
    }

    return (
        <div
            className={`${getEventBackground()} ${getEventTextColor()} rounded-lg`}
            style={{
                borderLeft: `4px solid ${staffColor}`,
                padding: "8px 12px",
                height: "100%",
                width: "100%",
                display: "flex",
                overflow: "hidden",
                flexDirection: "column",
                overflowY: "auto",
                overflowX: "auto",
                gap: "3px"
            }}
        >
            <div className="text-xs opacity-70">{timeRange}</div>
            <div className="text-sm font-medium">{event.title}</div>
            <div className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: staffColor }} />
                <span className="text-xs flex items-center">
                    {iconComponent}
                    {event.typeLabel}
                </span>
            </div>

            {/* Show duration for longer events */}
            {durationMinutes > 30 && (
                <div className="text-xs opacity-70 mt-1">
                    {Math.floor(durationMinutes / 60) > 0 ? `${Math.floor(durationMinutes / 60)}h ` : ''}
                    {durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}
                </div>
            )}

            {/* Staff indicator - small circle at the right side */}
            <div className="mt-1">
                <span className="text-xs opacity-70">{staffName}</span>
            </div>
        </div>
    )
}
