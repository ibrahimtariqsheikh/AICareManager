"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

// Import the Locale type from date-fns
import type { Locale } from "date-fns"

// Types to match the original component API
export interface CalendarProps {
    mode?: "single" | "range" | "multiple"
    selected?: Date | Date[] | { from: Date; to: Date }
    onSelect?: (date: Date | undefined) => void
    onRangeChange?: (range: { from: Date; to: Date } | undefined) => void
    disabled?: { from: Date; to: Date }[] | ((date: Date) => boolean)
    className?: string
    classNames?: Record<string, string>
    showOutsideDays?: boolean
    month?: Date
    defaultMonth?: Date
    numberOfMonths?: number
    fromDate?: Date
    toDate?: Date
    captionLayout?: "dropdown" | "buttons"
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    fixedWeeks?: boolean
    ISOWeek?: boolean
    locale?: Locale
    modifiers?: Record<string, (date: Date) => boolean>
    modifiersClassNames?: Record<string, string>
    styles?: Record<string, React.CSSProperties>
    isDateRangeCalendar?: boolean
}

function Calendar({
    selected,
    onSelect,
    onRangeChange,
    disabled,
    className,
    classNames,
    showOutsideDays = true,
    month: propMonth,
    defaultMonth,
    weekStartsOn = 0,
    fixedWeeks = false,
    isDateRangeCalendar = false }: CalendarProps) {
    // State for current month
    const [currentMonth, setCurrentMonth] = React.useState(() => {
        if (propMonth) return propMonth
        if (defaultMonth) return defaultMonth
        if (selected && !Array.isArray(selected) && !(selected as any).from) {
            return selected as Date
        }
        if (selected && Array.isArray(selected) && selected.length > 0) {
            return selected[0]
        }
        if (selected && (selected as any).from) {
            return (selected as { from: Date }).from
        }
        return new Date()
    })

    // State for animation direction
    const [, setDirection] = React.useState(0)

    // Date range selection states
    const [selectionState, setSelectionState] = React.useState<"start" | "end">("start")
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)
    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date } | undefined>(
        selected as { from: Date; to: Date } | undefined,
    )

    // Update month when prop changes
    React.useEffect(() => {
        if (propMonth) {
            setCurrentMonth(propMonth)
        }
    }, [propMonth])

    // Update dateRange when selected changes
    React.useEffect(() => {
        if (isDateRangeCalendar && selected && (selected as any).from) {
            setDateRange(selected as { from: Date; to: Date })
        }
    }, [selected, isDateRangeCalendar])

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    // Get day of week for first day of month
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    // Navigate to previous month
    const prevMonth = () => {
        setDirection(-1)
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev || new Date())
            newMonth.setMonth(newMonth.getMonth() - 1)
            return newMonth
        })
    }

    // Navigate to next month
    const nextMonth = () => {
        setDirection(1)
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev || new Date())
            newMonth.setMonth(newMonth.getMonth() + 1)
            return newMonth
        })
    }

    // Format date as YYYY-MM-DD for comparison
    const formatDateKey = (date: Date) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }

    // Check if two dates are the same day
    const isSameDay = (date1: Date, date2: Date) => {
        return formatDateKey(date1) === formatDateKey(date2)
    }

    // Check if a date is selected
    const isDateSelected = (date: Date) => {
        if (!selected) return false

        if (Array.isArray(selected)) {
            return selected.some((d) => formatDateKey(d) === formatDateKey(date))
        }

        if ((selected as any).from && (selected as any).to) {
            const { from, to } = selected as { from: Date; to: Date }
            return isSameDay(date, from) || isSameDay(date, to)
        }

        return formatDateKey(selected as Date) === formatDateKey(date)
    }

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    // Check if a date is disabled
    const isDateDisabled = (date: Date) => {
        if (!disabled) return false

        if (typeof disabled === "function") {
            return disabled(date)
        }

        return disabled.some((range) => date >= range.from && date <= range.to)
    }

    // Check if a date is in the selected range
    const isInRange = (date: Date) => {
        if (!isDateRangeCalendar) {
            if (!selected || !(selected as any).from || !(selected as any).to) return false
            const { from, to } = selected as { from: Date; to: Date }
            return date > from && date < to
        }

        // Date range calendar specific logic
        if (!dateRange) return false

        // If we're selecting the end date, show preview of range
        if (selectionState === "end" && hoverDate && dateRange.from) {
            if (hoverDate < dateRange.from) {
                return date > hoverDate && date < dateRange.from
            } else {
                return date > dateRange.from && date < hoverDate
            }
        }

        return (
            dateRange.from &&
            dateRange.to &&
            date > dateRange.from &&
            date < dateRange.to &&
            !isSameDay(date, dateRange.from) &&
            !isSameDay(date, dateRange.to)
        )
    }

    // Generate array of months
    const getMonths = () => {
        return Array.from({ length: 12 }, (_, i) => {
            const date = new Date(2000, i, 1)
            return {
                value: i,
                label: date.toLocaleString("default", { month: "long" }),
            }
        })
    }

    // Generate array of years (10 years before and after current year)
    const getYears = () => {
        const currentYear = new Date().getFullYear()
        return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
    }

    // Handle month change
    const handleMonthChange = (month: string) => {
        const newDate = new Date(currentMonth || new Date())
        newDate.setMonth(Number.parseInt(month))
        setCurrentMonth(newDate)
    }

    // Handle year change
    const handleYearChange = (year: string) => {
        const newDate = new Date(currentMonth || new Date())
        newDate.setFullYear(Number.parseInt(year))
        setCurrentMonth(newDate)
    }

    // Handle date selection
    const handleDateSelect = (date: Date) => {
        if (isDateDisabled(date)) return

        if (isDateRangeCalendar) {
            // Date range selection logic
            if (selectionState === "start") {
                // Start new selection
                const newRange = { from: date, to: date }
                setDateRange(newRange)
                setSelectionState("end")

                // Also call the regular onSelect if provided
                onSelect?.(date)
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

                // Call the range change callback
                onRangeChange?.(newRange)

                // Also call the regular onSelect if provided
                onSelect?.(date)
            }
        } else {
            // Regular date selection
            onSelect?.(date)
        }
    }

    // Handle date hover for preview in date range mode
    const handleDateHover = (date: Date) => {
        if (isDateRangeCalendar) {
            setHoverDate(date)
        }
    }

    // Generate calendar grid
    const renderCalendarGrid = () => {
        if (!currentMonth) return []
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = getDaysInMonth(year, month)
        const firstDayOfMonth = getFirstDayOfMonth(year, month)

        // Calculate days from previous month to show
        const daysFromPrevMonth = firstDayOfMonth - weekStartsOn
        const adjustedDaysFromPrevMonth = daysFromPrevMonth < 0 ? 7 + daysFromPrevMonth : daysFromPrevMonth

        // Get days from previous month
        const prevMonthDays = []
        if (showOutsideDays) {
            const prevMonth = month === 0 ? 11 : month - 1
            const prevMonthYear = month === 0 ? year - 1 : year
            const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

            for (let i = 0; i < adjustedDaysFromPrevMonth; i++) {
                const day = daysInPrevMonth - adjustedDaysFromPrevMonth + i + 1
                const date = new Date(prevMonthYear, prevMonth, day)
                prevMonthDays.push({ date, isOutside: true })
            }
        } else {
            for (let i = 0; i < adjustedDaysFromPrevMonth; i++) {
                prevMonthDays.push({ date: null, isOutside: true })
            }
        }

        // Current month days
        const currentMonthDays = []
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            currentMonthDays.push({ date, isOutside: false })
        }

        // Calculate how many days from next month to show
        const totalDaysShown = prevMonthDays.length + currentMonthDays.length
        const daysFromNextMonth = fixedWeeks
            ? Math.ceil(totalDaysShown / 7) * 7 - totalDaysShown
            : (7 - (totalDaysShown % 7)) % 7

        // Get days from next month
        const nextMonthDays = []
        if (showOutsideDays || fixedWeeks) {
            const nextMonth = month === 11 ? 0 : month + 1
            const nextMonthYear = month === 11 ? year + 1 : year

            for (let i = 1; i <= daysFromNextMonth; i++) {
                const date = new Date(nextMonthYear, nextMonth, i)
                nextMonthDays.push({ date, isOutside: true })
            }
        }

        // Combine all days
        const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]

        // Split into weeks
        const weeks = []
        for (let i = 0; i < allDays.length; i += 7) {
            weeks.push(allDays.slice(i, i + 7))
        }

        return weeks
    }

    // Weekday headers
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    const orderedWeekdays = [...weekdays.slice(weekStartsOn), ...weekdays.slice(0, weekStartsOn)]

    // Generate calendar
    const weeks = renderCalendarGrid()

    return (
        <div
            className={cn(
                "p-4 border rounded-lg shadow-md w-full max-w-full overflow-hidden bg-gradient-to-b from-background to-muted/20",
                className,
            )}
        >
            {isDateRangeCalendar && (
                <div className="mb-3 pb-2 border-b">
                    <h4 className="font-medium text-sm">
                        {selectionState === "start" ? "Select start date" : "Select end date"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        {selectionState === "start"
                            ? "Choose the first day of your range"
                            : `Start date: ${dateRange?.from.toLocaleDateString()}`}
                    </p>
                </div>
            )}

            <div className={cn("space-y-4", classNames?.month)}>
                <div className={cn("flex justify-between pt-1 relative items-center w-full gap-2", classNames?.caption)}>
                    <button
                        onClick={prevMonth}
                        className={cn(
                            buttonVariants({ variant: "outline", size: "icon" }),
                            "h-8 w-8 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-in-out",
                        )}
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div
                        className={cn(
                            "text-base font-medium text-center flex-grow flex items-center justify-center gap-2",
                            classNames?.caption_label,
                        )}
                    >
                        <select
                            value={currentMonth?.getMonth() || 0}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="bg-background border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-8"
                            aria-label="Select month"
                        >
                            {getMonths().map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={currentMonth?.getFullYear() || 0}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="bg-background border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-8"
                            aria-label="Select year"
                        >
                            {getYears().map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={nextMonth}
                        className={cn(
                            buttonVariants({ variant: "outline", size: "icon" }),
                            "h-8 w-8 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-in-out",
                        )}
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className={cn("w-full", classNames?.table)}>
                    <div className={cn("flex justify-between w-full mb-2 border-b pb-2", classNames?.head_row)}>
                        {orderedWeekdays.map((day) => (
                            <div
                                key={day}
                                className={cn(
                                    "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] text-center flex-shrink-0",
                                    classNames?.head_cell,
                                )}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div>
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className={cn("flex w-full mt-2.5 flex-nowrap", classNames?.row)}>
                                {week.map((day, dayIndex) => {
                                    if (!day.date) {
                                        return (
                                            <div
                                                key={`empty-${dayIndex}`}
                                                className={cn("h-9 w-9 p-0 text-center", classNames?.day_hidden)}
                                            />
                                        )
                                    }

                                    const isSelected = isDateSelected(day.date)
                                    const isDayToday = isToday(day.date)
                                    const isDisabled = isDateDisabled(day.date)
                                    const inRange = isInRange(day.date)

                                    // Range-specific classes
                                    const isRangeStart = selected && (selected as any).from && isSameDay(day.date, (selected as any).from)

                                    const isRangeEnd = selected && (selected as any).to && isSameDay(day.date, (selected as any).to)

                                    return (
                                        <div
                                            key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`}
                                            className={cn(
                                                "relative h-9 w-9 p-0 text-center flex items-center justify-center flex-shrink-0",
                                                day.isOutside && classNames?.day_outside,
                                                inRange && "bg-primary/20",
                                                isRangeStart && "rounded-l-md [&>button]:rounded-l-md",
                                                isRangeEnd && "rounded-r-md [&>button]:rounded-r-md",
                                                classNames?.cell,
                                            )}
                                        >
                                            <button
                                                onClick={() => handleDateSelect(day.date)}
                                                onMouseEnter={() => handleDateHover(day.date)}
                                                className={cn(
                                                    buttonVariants({ variant: "ghost" }),
                                                    "h-9 w-9 p-0 font-normal relative overflow-hidden",
                                                    (isSelected || isRangeStart || isRangeEnd) &&
                                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-medium",
                                                    isRangeStart && "rounded-l-md",
                                                    isRangeEnd && "rounded-r-md",
                                                    isDayToday &&
                                                    !isSelected &&
                                                    !isRangeStart &&
                                                    !isRangeEnd &&
                                                    "bg-accent text-accent-foreground ring-2 ring-primary ring-offset-1",
                                                    day.isOutside && "text-muted-foreground opacity-50",
                                                    isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
                                                    classNames?.day,
                                                    isSelected && classNames?.day_selected,
                                                    isDayToday && classNames?.day_today,
                                                    day.isOutside && classNames?.day_outside,
                                                    isDisabled && classNames?.day_disabled,
                                                )}
                                                disabled={isDisabled}
                                                type="button"
                                                tabIndex={day.isOutside ? -1 : 0}
                                            >
                                                {day.date.getDate()}
                                                {isDayToday && !isSelected && (
                                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                                )}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {isDateRangeCalendar && (
                    <div className="mt-4 pt-2 border-t flex justify-between">
                        <button
                            onClick={() => {
                                setDateRange(undefined)
                                setSelectionState("start")
                                onRangeChange?.(undefined)
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </button>

                        {selectionState === "end" && dateRange?.from && (
                            <button
                                onClick={() => {
                                    const newRange = { from: dateRange.from, to: dateRange.from }
                                    setDateRange(newRange)
                                    onRangeChange?.(newRange)
                                    setSelectionState("start")
                                }}
                                className="text-sm font-medium text-primary hover:text-primary/90"
                            >
                                Use Single Day
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

Calendar.displayName = "Calendar"

export { Calendar }