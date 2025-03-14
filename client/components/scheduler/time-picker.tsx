"use client"
import { Clock } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface TimePickerProps {
    value: string
    onChange: (time: string) => void
    label?: string
}

export function TimePickerDemo({ value, onChange, label }: TimePickerProps) {
    return (
        <div className="flex flex-col space-y-2">
            {label && <Label>{label}</Label>}
            <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 opacity-50" />
                <Input type="time" value={value} onChange={(e) => onChange(e.target.value)} className="w-full" />
            </div>
        </div>
    )
}

