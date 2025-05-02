"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { addMedication, closeAddMedicationModal } from "@/state/slices/medicationSlice"
import { Clock } from "lucide-react"

export function AddMedicationModal() {
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.medication.isAddMedicationModalOpen)

    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [frequency, setFrequency] = useState("")
    const [instructions, setInstructions] = useState("")
    const [times, setTimes] = useState({
        morning: false,
        afternoon: false,
        evening: false,
        bedtime: false,
        asNeeded: false,
    })

    const handleClose = () => {
        dispatch(closeAddMedicationModal())
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setDosage("")
        setFrequency("")
        setInstructions("")
        setTimes({
            morning: false,
            afternoon: false,
            evening: false,
            bedtime: false,
            asNeeded: false,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !dosage || !frequency) {
            return
        }

        dispatch(
            addMedication({
                name,
                dosage,
                frequency,
                instructions,
                times,
            }),
        )
    }

    const handleTimeChange = (timeOfDay: keyof typeof times) => {
        setTimes({
            ...times,
            [timeOfDay]: !times[timeOfDay],
        })
    }

    const timeOptions = [
        { id: "morning", label: "Morning", icon: "☀️" },
        { id: "afternoon", label: "Afternoon", icon: "🌤️" },
        { id: "evening", label: "Evening", icon: "🌙" },
        { id: "bedtime", label: "Bedtime", icon: "💤" },
        { id: "asNeeded", label: "As Needed", icon: "⏱️" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Add New Medication</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Medication Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter medication name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input
                                    id="dosage"
                                    value={dosage}
                                    onChange={(e) => setDosage(e.target.value)}
                                    placeholder="e.g., 5mg"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Input
                                    id="frequency"
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    placeholder="e.g., Daily"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                                id="instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Special instructions (optional)"
                                rows={2}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-teal-500" />
                                <span>Schedule Times</span>
                            </Label>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {timeOptions.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={option.id}
                                            checked={times[option.id as keyof typeof times]}
                                            onCheckedChange={() => handleTimeChange(option.id as keyof typeof times)}
                                        />
                                        <Label htmlFor={option.id} className="flex items-center cursor-pointer">
                                            <span className="mr-1.5">{option.icon}</span>
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                            disabled={!name || !dosage || !frequency}
                        >
                            Add Medication
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
