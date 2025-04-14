"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    className?: string
}

export function DatePickerWithRange({
    date,
    setDate,
    className,
}: DatePickerWithRangeProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL d, y")} - {format(date.to, "LLL d, y")}
                                </>
                            ) : (
                                format(date.from, "LLL d, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    <div className="flex items-center justify-between p-3 border-t">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const today = new Date()
                                    const thirtyDaysAgo = new Date()
                                    thirtyDaysAgo.setDate(today.getDate() - 30)
                                    setDate({
                                        from: thirtyDaysAgo,
                                        to: today,
                                    })
                                }}
                            >
                                Last 30 Days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const today = new Date()
                                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                                    setDate({
                                        from: startOfMonth,
                                        to: endOfMonth,
                                    })
                                }}
                            >
                                This Month
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => {
                                setDate(undefined)
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
