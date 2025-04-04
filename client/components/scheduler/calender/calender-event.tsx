"use client"

import moment from "moment"
import { Home, Video, Building2, Phone, User } from 'lucide-react'
import { type StaffMember } from "./types"
import { getStaffColor } from "./calender-utils"

interface CustomEventComponentProps {
    event: any
    staffMembers: StaffMember[]
    getEventDurationInMinutes: (event: any) => number
}

export function CustomEventComponent({ event, staffMembers, getEventDurationInMinutes }: CustomEventComponentProps) {
    const durationMinutes = event.durationMinutes || getEventDurationInMinutes(event)
    const startTime = moment(event.start).format("h:mm A")
    const endTime = moment(event.end).format("h:mm A")
    const timeRange = `${startTime} - ${endTime}`

    // Find staff member for this event
    const staffMember = staffMembers.find((s) => s.id === event.resourceId)
    const { staffColor, staffName } = getStaffColor(event, staffMembers)

    let iconComponent = null

    switch (event.type) {
        case "HOME_VISIT":
            iconComponent = <Home className="h-3 w-3 mr-1" />
            break
        case "VIDEO_CALL":
            iconComponent = <Video className="h-3 w-3 mr-1" />
            break
        case "HOSPITAL":
            iconComponent = <Building2 className="h-3 w-3 mr-1" />
            break
        case "AUDIO_CALL":
            iconComponent = <Phone className="h-3 w-3 mr-1" />
            break
        case "IN_PERSON":
            iconComponent = <User className="h-3 w-3 mr-1" />
            break
    }

    return (
        <div
            className={`${event.bgClass} rounded-lg`}
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
            <div className="text-xs text-gray-500">{timeRange}</div>
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
                <div className="text-xs text-gray-500 mt-1">
                    {Math.floor(durationMinutes / 60) > 0 ? `${Math.floor(durationMinutes / 60)}h ` : ''}
                    {durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}
                </div>
            )}

            {/* Staff indicator - small circle at the right side */}
            <div className="mt-1">
                <span className="text-xs text-gray-500">{staffName}</span>
            </div>
        </div>
    )
}
