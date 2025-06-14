import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, AlertCircle, CheckCircle, Heart, Flag, DollarSign, Baby, User, AlertTriangle, Home, Video, Building2, Phone, Stethoscope } from 'lucide-react';
import { useAppSelector } from "@/state/redux";
import moment from 'moment';
import { cn } from "@/lib/utils";
import type { AppointmentEvent, ProcessedCalendarEvent } from "../types";

interface CustomWeekViewProps {
    date: Date;
    onSelectEvent: (event: AppointmentEvent) => void;
    onEventUpdate: (event: AppointmentEvent) => void;
    staffMembers: any[];
    getEventDurationInMinutes: (event: AppointmentEvent) => number;
    events: ProcessedCalendarEvent[];
}

const CustomWeekView = ({ date, onSelectEvent, onEventUpdate, staffMembers, getEventDurationInMinutes, events }: CustomWeekViewProps) => {
    const [expandedSlot, setExpandedSlot] = useState(null);
    const activeScheduleUserType = useAppSelector((state) => state.schedule.activeScheduleUserType);
    const clients = useAppSelector((state) => state.user.clients || []);
    const careworkers = useAppSelector((state) => state.user.careWorkers || []);
    const officeStaff = useAppSelector((state) => state.user.officeStaff || []);
    const filteredUsers = useAppSelector((state) => state.schedule.filteredUsers);


    // Get the appropriate users based on activeScheduleUserType and filtered users
    const displayUsers = (() => {
        let users: any[] = [];
        if (activeScheduleUserType === "clients") {
            users = clients.filter(client => filteredUsers.clients.includes(client.id));
        } else if (activeScheduleUserType === "careWorker") {
            users = careworkers.filter(worker => filteredUsers.careWorkers.includes(worker.id));
        } else if (activeScheduleUserType === "officeStaff") {
            users = officeStaff.filter(staff => filteredUsers.officeStaff.includes(staff.id));
        }
        return users;
    })();

    // If no users are filtered, show all users
    const finalDisplayUsers = displayUsers.length > 0 ? displayUsers : (() => {
        if (activeScheduleUserType === "clients") return clients;
        if (activeScheduleUserType === "careWorker") return careworkers;
        if (activeScheduleUserType === "officeStaff") return officeStaff;
        return [];
    })();

    // Group events by day and time slot
    const getEventsForDayAndTime = (day: string, timeSlot: string) => {
        const weekStart = moment(date).startOf('week');
        const weekEnd = moment(date).endOf('week');


        return events.filter(event => {
            const eventDate = moment(event.start);
            const eventTime = moment(event.start).format('h:mm A');


            // Check if event is within the current week
            const isInCurrentWeek = eventDate.isBetween(weekStart, weekEnd, 'day', '[]');

            // Check if event matches the day and time
            const matchesDayAndTime = eventDate.format('ddd').toLowerCase() === day.toLowerCase() &&
                eventTime === timeSlot;

            // Filter based on activeScheduleUserType
            const matchesUserType = (() => {
                switch (activeScheduleUserType) {
                    case "clients":
                        return event.clientId && filteredUsers.clients.includes(event.clientId);
                    case "careWorker":
                        return event.resourceId && filteredUsers.careWorkers.includes(event.resourceId);
                    case "officeStaff":
                        return event.resourceId && filteredUsers.officeStaff.includes(event.resourceId);
                    default:
                        return true; // Show all events if no specific type is selected
                }
            })();


            return isInCurrentWeek && matchesDayAndTime && matchesUserType;
        });
    };

    // Add this function to get the display title
    const getEventDisplayTitle = (event: AppointmentEvent) => {
        return activeScheduleUserType === "careWorker" ? event.client?.fullName : event.title;
    };



    // Update time slots to cover the full day with more granular times
    const timeSlots = [
        '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
        '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
        '6:00 PM', '6:30 PM', '7:00 PM'
    ];

    const days = [
        { day: 'SUN', date: moment(date).startOf('week').format('D'), key: 'sun' },
        { day: 'MON', date: moment(date).startOf('week').add(1, 'day').format('D'), key: 'mon' },
        { day: 'TUE', date: moment(date).startOf('week').add(2, 'day').format('D'), key: 'tue' },
        { day: 'WED', date: moment(date).startOf('week').add(3, 'day').format('D'), key: 'wed' },
        { day: 'THU', date: moment(date).startOf('week').add(4, 'day').format('D'), key: 'thu' },
        { day: 'FRI', date: moment(date).startOf('week').add(5, 'day').format('D'), key: 'fri' },
        { day: 'SAT', date: moment(date).startOf('week').add(6, 'day').format('D'), key: 'sat' }
    ];



    const getEventBackground = (event: AppointmentEvent, isActive = false, isHovered = false) => {
        if (event.isLeaveEvent) {
            const leaveIcons = {
                ANNUAL_LEAVE: {
                    bg: 'bg-green-50',
                    hoverBg: 'bg-green-100',
                    activeBg: 'bg-green-200',
                    text: 'text-green-700',
                    border: 'border-green-500'
                },
                SICK_LEAVE: {
                    bg: 'bg-red-50',
                    hoverBg: 'bg-red-100',
                    activeBg: 'bg-red-200',
                    text: 'text-red-700',
                    border: 'border-red-500'
                },
                PUBLIC_HOLIDAY: {
                    bg: 'bg-blue-50',
                    hoverBg: 'bg-blue-100',
                    activeBg: 'bg-blue-200',
                    text: 'text-blue-700',
                    border: 'border-blue-500'
                },
                UNPAID_LEAVE: {
                    bg: 'bg-gray-50',
                    hoverBg: 'bg-gray-100',
                    activeBg: 'bg-gray-200',
                    text: 'text-gray-700',
                    border: 'border-gray-500'
                },
                MATERNITY_LEAVE: {
                    bg: 'bg-pink-50',
                    hoverBg: 'bg-pink-100',
                    activeBg: 'bg-pink-200',
                    text: 'text-pink-700',
                    border: 'border-pink-500'
                },
                PATERNITY_LEAVE: {
                    bg: 'bg-purple-50',
                    hoverBg: 'bg-purple-100',
                    activeBg: 'bg-purple-200',
                    text: 'text-purple-700',
                    border: 'border-purple-500'
                },
                BEREAVEMENT_LEAVE: {
                    bg: 'bg-brown-50',
                    hoverBg: 'bg-brown-100',
                    activeBg: 'bg-brown-200',
                    text: 'text-brown-700',
                    border: 'border-brown-500'
                },
                EMERGENCY_LEAVE: {
                    bg: 'bg-orange-50',
                    hoverBg: 'bg-orange-100',
                    activeBg: 'bg-orange-200',
                    text: 'text-orange-700',
                    border: 'border-orange-500'
                },
                MEDICAL_APPOINTMENT: {
                    bg: 'bg-cyan-50',
                    hoverBg: 'bg-cyan-100',
                    activeBg: 'bg-cyan-200',
                    text: 'text-cyan-700',
                    border: 'border-cyan-500'
                },
                TOIL: {
                    bg: 'bg-amber-50',
                    hoverBg: 'bg-amber-100',
                    activeBg: 'bg-amber-200',
                    text: 'text-amber-700',
                    border: 'border-amber-500'
                }
            }
            const style = leaveIcons[event.leaveType as keyof typeof leaveIcons] || {
                bg: 'bg-gray-50',
                hoverBg: 'bg-gray-100',
                activeBg: 'bg-gray-200',
                text: 'text-gray-700',
                border: 'border-gray-500'
            }
            return {
                bg: isActive ? style.activeBg : isHovered ? style.hoverBg : style.bg,
                text: style.text,
                border: style.border
            }
        }

        const statusColors = {
            PENDING: {
                bg: 'bg-blue-50',
                hoverBg: 'bg-blue-100',
                activeBg: 'bg-blue-200',
                text: 'text-blue-700',
                border: 'border-blue-500'
            },
            CONFIRMED: {
                bg: 'bg-green-50',
                hoverBg: 'bg-green-100',
                activeBg: 'bg-green-200',
                text: 'text-green-700',
                border: 'border-green-500'
            },
            COMPLETED: {
                bg: 'bg-green-50',
                hoverBg: 'bg-green-100',
                activeBg: 'bg-green-200',
                text: 'text-green-700',
                border: 'border-green-500'
            },
            CANCELED: {
                bg: 'bg-red-50',
                hoverBg: 'bg-red-100',
                activeBg: 'bg-red-200',
                text: 'text-red-700',
                border: 'border-red-500'
            }
        }

        const style = statusColors[event.status as keyof typeof statusColors] || statusColors.PENDING
        return {
            bg: isActive ? style.activeBg : isHovered ? style.hoverBg : style.bg,
            text: style.text,
            border: style.border
        }
    }

    const getEventIcon = (event: AppointmentEvent) => {
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

    // Add handleCreateVisit function
    const handleCreateVisit = (time: string, day: string) => {
        // Convert time from "h:mm A" to "HH:mm" format
        const timeObj = moment(time, "h:mm A");
        const formattedTime = timeObj.format("HH:mm");

        const tempEvent: AppointmentEvent = {
            id: `temp-${Date.now()}`,
            title: 'New Visit',
            start: new Date(`${moment(date).startOf('week').add(days.findIndex(d => d.day === day), 'days').format('YYYY-MM-DD')}T${formattedTime}`),
            end: new Date(`${moment(date).startOf('week').add(days.findIndex(d => d.day === day), 'days').format('YYYY-MM-DD')}T${formattedTime}`),
            date: moment(date).startOf('week').add(days.findIndex(d => d.day === day), 'days').toDate(),
            startTime: formattedTime,
            endTime: formattedTime,
            resourceId: '',
            clientId: '',
            type: 'HOME_VISIT',
            status: 'PENDING',
            notes: '',
            color: '#4CAF50',
            careWorker: {
                fullName: 'Unassigned'
            },
            client: {
                fullName: ''
            }
        };

        onSelectEvent(tempEvent);
    };

    return (
        <div className="px-6 min-h-screen pb-6">
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="grid grid-cols-8 border-b bg-gray-50">
                    <div className="p-3 text-xs text-gray-500 font-medium">Time</div>
                    {days.map((day) => (
                        <div key={day.day} className="p-3 text-center border-l">
                            <div className="text-xs text-gray-500 font-medium">{day.day}</div>
                            <div className="text-lg font-semibold mt-1">{day.date}</div>
                        </div>
                    ))}
                </div>

                <div className="divide-y">
                    {timeSlots.map((time, timeIndex) => {
                        const hasExpandedSlotInThisRow = days.some(day => {
                            const slotKey = `${day.key}-${timeIndex + 7}`;
                            return expandedSlot === slotKey;
                        });

                        const hasEventsInThisRow = days.some(day => {
                            const visits = getEventsForDayAndTime(day.day, time);
                            return visits.length > 0;
                        });

                        return (
                            <div key={time} className={`grid grid-cols-8 ${hasExpandedSlotInThisRow ? 'min-h-[200px]' : hasEventsInThisRow ? 'min-h-[70px]' : 'min-h-[25px]'}`}>
                                <div className={`text-xs text-gray-500 font-medium border-r bg-gray-50 ${hasEventsInThisRow ? 'p-3' : 'py-1 px-2'}`}>
                                    {time}
                                </div>
                                {days.map((day, dayIndex) => {
                                    const slotKey = `${day.key}-${timeIndex + 7}`;
                                    const visits = getEventsForDayAndTime(day.day, time);
                                    const isExpanded = expandedSlot === slotKey;

                                    return (
                                        <div
                                            key={`${day.day}-${time}`}
                                            className={`border-l relative ${hasEventsInThisRow ? 'p-1' : 'py-0.5 px-0.5'} group`}
                                        >
                                            {visits.length > 0 ? (
                                                <div className="h-full">
                                                    {!isExpanded && visits.length <= 3 ? (
                                                        // Show full details for 3 or fewer visits
                                                        <div className="space-y-1">
                                                            {visits.map((visit) => {
                                                                const { bg, text, border } = getEventBackground(visit);
                                                                const eventIcon = getEventIcon(visit);
                                                                return (
                                                                    <div
                                                                        key={visit.id}
                                                                        className={`p-2 rounded-lg text-xs ${bg} ${text} ${border} ${visit.isLeaveEvent ? 'border-l-4' : 'border-l-2'} transition-all hover:shadow-sm cursor-pointer`}
                                                                        style={{
                                                                            borderLeftWidth: visit.isLeaveEvent ? "4px" : "2px",
                                                                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                                                        }}
                                                                        onClick={() => onSelectEvent(visit)}
                                                                    >
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            {eventIcon}
                                                                            <span className="font-medium truncate">{getEventDisplayTitle(visit)}</span>
                                                                        </div>
                                                                        <div className={`text-[10px] flex items-center ${text}`}>
                                                                            {moment(visit.start).format('h:mm A')} - {moment(visit.end).format('h:mm A')}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : !isExpanded ? (
                                                        // Show compact view for more than 3 visits
                                                        <div className="space-y-1">
                                                            {visits.slice(0, 3).map((visit) => {
                                                                const { bg, text, border } = getEventBackground(visit);
                                                                const eventIcon = getEventIcon(visit);
                                                                return (
                                                                    <div
                                                                        key={visit.id}
                                                                        className={`p-2 rounded-lg text-xs ${bg} ${text} ${border} ${visit.isLeaveEvent ? 'border-l-4' : 'border-l-2'} transition-all hover:shadow-sm cursor-pointer`}
                                                                        style={{
                                                                            borderLeftWidth: visit.isLeaveEvent ? "4px" : "2px",
                                                                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                                                        }}
                                                                        onClick={() => onSelectEvent(visit)}
                                                                    >
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            {eventIcon}
                                                                            <span className="font-medium truncate">{getEventDisplayTitle(visit)}</span>
                                                                        </div>
                                                                        <div className={`text-[10px] flex items-center ${text}`}>
                                                                            {moment(visit.start).format('h:mm A')} - {moment(visit.end).format('h:mm A')}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            <button
                                                                onClick={() => setExpandedSlot(slotKey as any)}
                                                                className="w-full text-xs text-blue-600 hover:text-blue-800 text-center py-1 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                                                            >
                                                                +{visits.length - 3} more
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // Expanded view
                                                        <div className="h-full flex flex-col">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-medium text-gray-700">{visits.length} Visits</span>
                                                                <button
                                                                    onClick={() => setExpandedSlot(null)}
                                                                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <div className="flex-1 space-y-1 overflow-y-auto">
                                                                {visits.map((visit) => {
                                                                    const { bg, text, border } = getEventBackground(visit);
                                                                    const eventIcon = getEventIcon(visit);
                                                                    return (
                                                                        <div
                                                                            key={visit.id}
                                                                            className={`p-2 rounded-lg text-xs ${bg} ${text} ${border} ${visit.isLeaveEvent ? 'border-l-4' : 'border-l-2'} transition-all hover:shadow-sm cursor-pointer`}
                                                                            style={{
                                                                                borderLeftWidth: visit.isLeaveEvent ? "4px" : "2px",
                                                                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                                                            }}
                                                                            onClick={() => onSelectEvent(visit)}
                                                                        >
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                {eventIcon}
                                                                                <span className="font-medium truncate">{getEventDisplayTitle(visit)}</span>
                                                                            </div>
                                                                            <div className={`text-[10px] flex items-center ${text}`}>
                                                                                {moment(visit.start).format('h:mm A')} - {moment(visit.end).format('h:mm A')}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className={cn("absolute inset-1 border-2 border-dashed rounded-lg transition-all border-blue-300 opacity-0 group-hover:opacity-100 bg-blue-50/20 flex items-center justify-center cursor-pointer", hasEventsInThisRow ? "rounded-lg" : "rounded-[2px]")}
                                                    onClick={() => handleCreateVisit(time, day.day)}
                                                >
                                                    {!hasEventsInThisRow ? (
                                                        <span className={cn("text-[10px]  font-medium", hasEventsInThisRow ? "text-blue-500" : "text-blue-600")}>Add</span>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[11px] font-medium text-blue-600">
                                                                {time}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">
                                                                Click to add event
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomWeekView;