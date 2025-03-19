"use client"

import moment from "moment"

interface CustomDayHeaderProps {
    date: Date
}

export function CustomDayHeader({ date }: CustomDayHeaderProps) {
    const dayName = moment(date).format("ddd").toUpperCase()
    const dateNumber = moment(date).date()
    const isToday = moment(date).isSame(moment(), "day")

    return (
        <div className="custom-day-header flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500">{dayName}</span>
            <span className={`text-sm ${isToday ? "text-blue-500 font-bold" : "text-gray-600"}`}>
                {dateNumber}
            </span>
        </div>
    )
}
