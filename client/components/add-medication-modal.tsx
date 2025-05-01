"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { closeAddMedicationModal } from "@/state/slices/medicationSlice"
import { api } from "@/state/api"
import { Pill } from "lucide-react"

interface AddMedicationModalProps {
    userId: string
}

export function AddMedicationModal({ userId }: AddMedicationModalProps) {
    const dispatch = useAppDispatch()
    const { isAddMedicationModalOpen } = useAppSelector((state) => state.medication)

    const [createMedication] = api.useCreateMedicationRecordMutation()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !dosage || !frequency) {
            return
        }

        try {
            await createMedication({
                name,
                dosage,
                frequency,
                instructions: instructions.trim() || "",
                times,
                clientId: userId,
            }).unwrap()

            handleClose()
        } catch (error) {
            console.error("Failed to create medication:", error)
        }
    }

    const handleTimeChange = (time: keyof typeof times) => {
        setTimes((prev) => ({
            ...prev,
            [time]: !prev[time],
        }))
    }

    return (
        <Dialog open={isAddMedicationModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <Pill className="mr-2 w-5 h-5" />
                        Add New Medication
                    </DialogTitle>
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

                        <div className="grid gap-2">
                            <Label htmlFor="dosage">Dosage</Label>
                            <Input
                                id="dosage"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                placeholder="Enter dosage (e.g., 500mg)"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Input
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                placeholder="Enter frequency (e.g., Once daily)"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="instructions">Instructions (Optional)</Label>
                            <Textarea
                                id="instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Enter any special instructions"
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Administration Times</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(times).map(([time, isChecked]) => (
                                    <div key={time} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={time}
                                            checked={isChecked}
                                            onCheckedChange={() => handleTimeChange(time as keyof typeof times)}
                                        />
                                        <Label htmlFor={time} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {time.charAt(0).toUpperCase() + time.slice(1)}
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
                        <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                            Add Medication
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 