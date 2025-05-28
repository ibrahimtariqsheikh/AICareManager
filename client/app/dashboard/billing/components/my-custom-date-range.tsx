"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

interface DateRangeSelectorProps {
    className?: string
    onRangeChange?: (range: { from: Date; to: Date } | undefined) => void
    initialDateRange?: { from: Date; to: Date } | undefined
    placeholder?: string
    disabled?: boolean
    position?: "top" | "bottom"
    oneDate?: boolean
}

export function MyCustomDateRange({
    className,
    onRangeChange,
    initialDateRange,
    placeholder = "Select date range",
    disabled = false,
    position = "bottom",
    oneDate = false
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

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleDateSelect = (date: Date, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (oneDate) {
            const newRange = { from: date, to: date }
            setDateRange(newRange)
            onRangeChange?.(newRange)
            setIsOpen(false)
            return
        }

        if (selectionState === "start") {
            setDateRange({ from: date, to: date })
            setSelectionState("end")
        } else {
            let newRange
            if (date < (dateRange?.from || new Date())) {
                newRange = { from: date, to: dateRange?.from || date }
            } else {
                newRange = { from: dateRange?.from || date, to: date }
            }
            setDateRange(newRange)
            setSelectionState("start")
            onRangeChange?.(newRange)
            if (newRange.from && newRange.to) {
                setIsOpen(false)
            }
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDateRange(undefined)
        setSelectionState("start")
        onRangeChange?.(undefined)
    }

    const formatDate = (date: Date) => {
        const day = date.getDate()
        const month = MONTHS[date.getMonth()]
        const year = date.getFullYear()
        return `${month} ${day}, ${year}`
    }

    const formatDateRange = () => {
        if (!dateRange) return placeholder
        if (oneDate || (dateRange.from && dateRange.to && dateRange.from.getTime() === dateRange.to.getTime())) {
            return formatDate(dateRange.from)
        }
        return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
    }

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md",
                    disabled ? "bg-muted cursor-not-allowed" : "hover:bg-muted/50"
                )}
            >
                <span className="text-muted-foreground">{formatDateRange()}</span>
                <div className="flex items-center gap-2">
                    {dateRange && (
                        <X
                            className="h-4 w-4 text-muted-foreground hover:text-foreground"
                            onClick={handleClear}
                        />
                    )}
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </div>
            </button>
            {isOpen && !disabled && (
                <div className={cn(
                    "absolute z-50 w-[300px] bg-popover text-popover-foreground shadow-md rounded-md border",
                    position === "top" ? "bottom-full mb-1" : "top-full mt-1"
                )}>
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={() => setCurrentMonth(prev => {
                                    const newMonth = new Date(prev)
                                    newMonth.setMonth(newMonth.getMonth() - 1)
                                    return newMonth
                                })}
                                className="p-1 hover:bg-muted rounded"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="font-medium">
                                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                onClick={() => setCurrentMonth(prev => {
                                    const newMonth = new Date(prev)
                                    newMonth.setMonth(newMonth.getMonth() + 1)
                                    return newMonth
                                })}
                                className="p-1 hover:bg-muted rounded"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-sm text-muted-foreground py-1">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 42 }, (_, i) => {
                                const date = new Date(currentMonth)
                                date.setDate(1)
                                date.setDate(date.getDate() + i - date.getDay())
                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                                const isSelected = dateRange && (
                                    date.getTime() === dateRange.from.getTime() ||
                                    date.getTime() === dateRange.to.getTime()
                                )
                                const isInRange = dateRange && dateRange.from && dateRange.to && (
                                    date > dateRange.from && date < dateRange.to
                                )
                                return (
                                    <button
                                        key={i}
                                        onClick={(e) => handleDateSelect(date, e)}
                                        onMouseEnter={() => setHoverDate(date)}
                                        onMouseLeave={() => setHoverDate(null)}
                                        className={cn(
                                            "h-8 w-8 rounded-full text-sm",
                                            !isCurrentMonth && "text-muted-foreground",
                                            isSelected && "bg-primary text-primary-foreground",
                                            isInRange && "bg-primary/20",
                                            "hover:bg-muted"
                                        )}
                                    >
                                        {date.getDate()}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 