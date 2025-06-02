import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewMileageFormProps {
    onClose: () => void
}

export function NewMileageForm({ onClose }: NewMileageFormProps) {
    const [date, setDate] = useState<Date>()
    const [employee, setEmployee] = useState("")
    const [client, setClient] = useState("")
    const [fromAddress, setFromAddress] = useState("")
    const [toAddress, setToAddress] = useState("")
    const [distance, setDistance] = useState("")
    const [travelTime, setTravelTime] = useState("")
    const [appointmentType, setAppointmentType] = useState("")
    const [notes, setNotes] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
            // TODO: Implement form submission
            ({
                date,
                employee,
                client,
                fromAddress,
                toAddress,
                distance,
                travelTime,
                appointmentType,
                notes
            })
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select value={employee} onValueChange={setEmployee}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="john-smith">John Smith</SelectItem>
                            <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                            <SelectItem value="emily-davis">Emily Davis</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select value={client} onValueChange={setClient}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="maria-garcia">Maria Garcia</SelectItem>
                        <SelectItem value="robert-chen">Robert Chen</SelectItem>
                        <SelectItem value="linda-thompson">Linda Thompson</SelectItem>
                        <SelectItem value="james-miller">James Miller</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fromAddress">From Address</Label>
                    <Textarea
                        id="fromAddress"
                        value={fromAddress}
                        onChange={(e) => setFromAddress(e.target.value)}
                        placeholder="Enter starting address"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="toAddress">To Address</Label>
                    <Textarea
                        id="toAddress"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="Enter destination address"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="distance">Distance (miles)</Label>
                    <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="Enter distance"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="travelTime">Travel Time (minutes)</Label>
                    <Input
                        id="travelTime"
                        type="number"
                        value={travelTime}
                        onChange={(e) => setTravelTime(e.target.value)}
                        placeholder="Enter travel time"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="appointmentType">Appointment Type</Label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="home-visit">Home Visit</SelectItem>
                        <SelectItem value="weekly-checkup">Weekly Checkup</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes"
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">Create Entry</Button>
            </div>
        </form>
    )
} 