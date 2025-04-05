"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface MedicationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    medication?: any
}

export function MedicationDialog({ open, onOpenChange, medication }: MedicationDialogProps) {
    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [instructions, setInstructions] = useState("")
    const [reason, setReason] = useState("")
    const [route, setRoute] = useState("oral")
    const [frequency, setFrequency] = useState("daily")
    const [times, setTimes] = useState<string[]>(["08:00"])
    const [days, setDays] = useState<string[]>(["monday", "wednesday", "friday"])
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize form when medication changes
    useEffect(() => {
        if (medication) {
            setName(medication.name || "")
            setDosage(medication.dosage || "")
            setInstructions(medication.instructions || "")
            setReason(medication.reason || "")
            setRoute("oral")
            setFrequency("daily")
            setTimes(["08:00"])
            setDays(["monday", "wednesday", "friday"])
            setNotes("")
        } else {
            // Reset form for new medication
            setName("")
            setDosage("")
            setInstructions("")
            setReason("")
            setRoute("oral")
            setFrequency("daily")
            setTimes(["08:00"])
            setDays(["monday", "wednesday", "friday"])
            setNotes("")
        }
    }, [medication, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success(medication ? "Medication updated successfully" : "Medication added successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to save medication")
        } finally {
            setIsSubmitting(false)
        }
    }

    const addTime = () => {
        setTimes([...times, ""])
    }

    const updateTime = (index: number, value: string) => {
        const newTimes = [...times]
        newTimes[index] = value
        setTimes(newTimes)
    }

    const removeTime = (index: number) => {
        setTimes(times.filter((_, i) => i !== index))
    }

    const toggleDay = (day: string) => {
        if (days.includes(day)) {
            setDays(days.filter((d) => d !== day))
        } else {
            setDays([...days, day])
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{medication ? "Edit Medication" : "Add New Medication"}</DialogTitle>
                    <DialogDescription>
                        {medication ? "Update the medication details below." : "Enter the details of the new medication."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Medication Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Hydrocortisone"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dosage">Dosage</Label>
                            <Input
                                id="dosage"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                placeholder="e.g., 5mg"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Input
                            id="instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g., Take 1 Tab by Mouth Twice Daily"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Medication</Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Hypertension"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="route">Administration Route</Label>
                            <Select value={route} onValueChange={setRoute}>
                                <SelectTrigger id="route">
                                    <SelectValue placeholder="Select route" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oral">Oral</SelectItem>
                                    <SelectItem value="topical">Topical</SelectItem>
                                    <SelectItem value="injection">Injection</SelectItem>
                                    <SelectItem value="inhalation">Inhalation</SelectItem>
                                    <SelectItem value="rectal">Rectal</SelectItem>
                                    <SelectItem value="vaginal">Vaginal</SelectItem>
                                    <SelectItem value="ophthalmic">Ophthalmic</SelectItem>
                                    <SelectItem value="otic">Otic</SelectItem>
                                    <SelectItem value="nasal">Nasal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger id="frequency">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="twice_daily">Twice Daily</SelectItem>
                                    <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                                    <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="as_needed">As Needed (PRN)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Administration Times</Label>
                        {times.map((time, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => updateTime(index, e.target.value)}
                                    className="flex-1"
                                />
                                {times.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTime(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        &times;
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addTime}>
                            Add Time
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Days of Administration</Label>
                        <div className="flex flex-wrap gap-2">
                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                                <div key={day} className="flex items-center space-x-2">
                                    <Checkbox id={day} checked={days.includes(day)} onCheckedChange={() => toggleDay(day)} />
                                    <Label htmlFor={day} className="capitalize">
                                        {day}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any additional information about this medication..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting ? "Saving..." : medication ? "Update Medication" : "Add Medication"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

