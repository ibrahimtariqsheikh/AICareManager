"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const formatDate = (date: Date) => {
    const day = date.getDate()
    const month = MONTHS[date.getMonth()]
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
}

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
    return formatDateKey(date1) === formatDateKey(date2)
}

// Check if a date is between two other dates
const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate
}

interface DateRangeSelectorProps {
    className?: string
    onRangeChange?: (range: { from: Date; to: Date } | undefined) => void
    initialDateRange?: { from: Date; to: Date }
    placeholder?: string
    disabled?: boolean
}

export function CustomDateRangeSelector({
    className,
    onRangeChange,
    initialDateRange,
    placeholder = "Select date range",
    disabled = false,
}: DateRangeSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | undefined>(initialDateRange)
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = React.useState(() => {
        if (initialDateRange?.from) return new Date(initialDateRange.from)
        return new Date()
    })
    const [selectionState, setSelectionState] = React.useState<"start" | "end">("start")

    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Handle date selection
    const handleDateSelect = (date: Date) => {
        if (selectionState === "start") {
            // Start new selection
            setDateRange({ from: date, to: date })
            setSelectionState("end")
        } else {
            // Complete selection
            let newRange

            if (date < (dateRange?.from || new Date())) {
                // If end date is before start date, swap them
                newRange = { from: date, to: dateRange?.from || date }
            } else {
                newRange = { from: dateRange?.from || date, to: date }
            }

            setDateRange(newRange)
            setSelectionState("start")
            onRangeChange?.(newRange)
            setIsOpen(false)
        }
    }

    // Handle date hover for preview
    const handleDateHover = (date: Date) => {
        setHoverDate(date)
    }

    // Clear the selection
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDateRange(undefined)
        setSelectionState("start")
        onRangeChange?.(undefined)
    }

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev)
            newMonth.setMonth(newMonth.getMonth() - 1)
            return newMonth
        })
    }

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev)
            newMonth.setMonth(newMonth.getMonth() + 1)
            return newMonth
        })
    }

    // Generate calendar grid for current month
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        // First day of the month
        const firstDay = new Date(year, month, 1)
        const firstDayIndex = firstDay.getDay()

        // Last day of the month
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()

        // Days from previous month
        const prevMonthDays = []
        const prevMonth = month === 0 ? 11 : month - 1
        const prevMonthYear = month === 0 ? year - 1 : year
        const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

        for (let i = firstDayIndex; i > 0; i--) {
            const day = daysInPrevMonth - i + 1
            prevMonthDays.push({
                date: new Date(prevMonthYear, prevMonth, day),
                isCurrentMonth: false,
            })
        }

        // Days from current month
        const currentMonthDays = []
        for (let day = 1; day <= daysInMonth; day++) {
            currentMonthDays.push({
                date: new Date(year, month, day),
                isCurrentMonth: true,
            })
        }

        // Days from next month
        const nextMonthDays = []
        const nextMonth = month === 11 ? 0 : month + 1
        const nextMonthYear = month === 11 ? year + 1 : year
        const totalDaysShown = prevMonthDays.length + currentMonthDays.length
        const daysToAdd = 42 - totalDaysShown // Always show 6 weeks (42 days)

        for (let day = 1; day <= daysToAdd; day++) {
            nextMonthDays.push({
                date: new Date(nextMonthYear, nextMonth, day),
                isCurrentMonth: false,
            })
        }

        // Combine all days
        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
    }

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date()
        return isSameDay(date, today)
    }

    // Check if a date is selected
    const isSelected = (date: Date) => {
        if (!dateRange) return false

        return isSameDay(date, dateRange.from) || isSameDay(date, dateRange.to)
    }

    // Check if a date is in the selected range
    const isInRange = (date: Date) => {
        if (!dateRange) return false

        // If we're selecting the end date, show preview of range
        if (selectionState === "end" && hoverDate && dateRange.from) {
            if (hoverDate < dateRange.from) {
                return isDateInRange(date, hoverDate, dateRange.from)
            } else {
                return isDateInRange(date, dateRange.from, hoverDate)
            }
        }

        return (
            dateRange.from &&
            dateRange.to &&
            isDateInRange(date, dateRange.from, dateRange.to) &&
            !isSameDay(date, dateRange.from) &&
            !isSameDay(date, dateRange.to)
        )
    }

    // Format the date range for display
    const formatDateRange = () => {
        if (!dateRange) return placeholder

        if (isSameDay(dateRange.from, dateRange.to)) {
            return formatDate(dateRange.from)
        }

        return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
    }

    // Generate weeks array for rendering
    const calendarDays = generateCalendarDays()
    const weeks = []
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7))
    }

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            {/* Date Range Input */}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    !dateRange && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
                disabled={disabled}
            >
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="flex-1 truncate">{formatDateRange()}</span>
                </div>
                {dateRange && (
                    <X className="h-4 w-4 opacity-70 hover:opacity-100" onClick={handleClear} aria-label="Clear date range" />
                )}
            </button>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-1 w-auto min-w-[320px] rounded-md border bg-popover p-4 shadow-md animate-in fade-in-0 zoom-in-95">
                    {/* Header with instructions */}
                    <div className="mb-3 pb-2 border-b">
                        <h4 className="font-medium text-sm">
                            {selectionState === "start" ? "Select start date" : "Select end date"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                            {selectionState === "start"
                                ? "Choose the first day of your range"
                                : `Start date: ${formatDate(dateRange?.from || new Date())}`}
                        </p>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={prevMonth}
                            className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <h2 className="font-medium text-sm">
                            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>

                        <button
                            onClick={nextMonth}
                            className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="select-none">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 mb-1">
                            {DAYS.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                                    {day.slice(0, 1)}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="space-y-1">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                                    {week.map(({ date, isCurrentMonth }) => {
                                        const isStart = dateRange?.from && isSameDay(date, dateRange.from)
                                        const isEnd = dateRange?.to && isSameDay(date, dateRange.to)
                                        const inRange = isInRange(date)
                                        const isCurrentDay = isToday(date)

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => handleDateSelect(date)}
                                                onMouseEnter={() => handleDateHover(date)}
                                                className={cn(
                                                    "h-8 w-8 p-0 rounded-md text-center text-sm relative flex items-center justify-center",
                                                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                    "transition-colors duration-200",
                                                    !isCurrentMonth && "text-muted-foreground opacity-50",
                                                    isStart &&
                                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                                    isEnd && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                                    inRange && "bg-primary/10",
                                                    isCurrentDay && !isSelected(date) && "border border-primary",
                                                )}
                                            >
                                                {date.getDate()}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer with actions */}
                    <div className="mt-4 pt-2 border-t flex justify-between">
                        <button
                            onClick={() => {
                                setDateRange(undefined)
                                setSelectionState("start")
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </button>

                        {selectionState === "end" && (
                            <button
                                onClick={() => {
                                    if (dateRange?.from) {
                                        const newRange = { from: dateRange.from, to: dateRange.from }
                                        setDateRange(newRange)
                                        onRangeChange?.(newRange)
                                        setIsOpen(false)
                                    }
                                }}
                                className="text-sm font-medium text-primary hover:text-primary/90"
                            >
                                Use Single Day
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
