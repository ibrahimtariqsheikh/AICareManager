"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calender"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface DatePickerWithRangeProps {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
    const selectedDate = date?.from && date?.to ? { from: date.from, to: date.to } : { from: new Date(), to: new Date() }

    return (
        <div className="space-y-2">
            <div className="font-medium text-sm">Date Range</div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from || new Date()}
                        selected={selectedDate}
                        onRangeChange={setDate}
                        numberOfMonths={2}
                        isDateRangeCalendar={true}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
