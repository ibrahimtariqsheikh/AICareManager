"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateMedicationLog, closeCheckInModal } from "@/state/slices/medicationSlice"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function CheckInModal() {
    const dispatch = useAppDispatch()
    const {
        isCheckInModalOpen,
        selectedMedicationId,
        selectedTimeOfDay,
        selectedDay,
        selectedMonth,
        selectedYear,
        medications,
    } = useAppSelector((state) => state.medication)

    const [status, setStatus] = useState<"taken" | "not-taken" | "not-reported">("taken")
    const [notes, setNotes] = useState("")

    const selectedMedication = medications.find((med) => med.id === selectedMedicationId)

    const handleClose = () => {
        dispatch(closeCheckInModal())
        resetForm()
    }

    const resetForm = () => {
        setStatus("taken")
        setNotes("")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedMedicationId || !selectedTimeOfDay || selectedDay === null) {
            return
        }

        dispatch(
            updateMedicationLog({
                medicationId: selectedMedicationId,
                day: selectedDay,
                month: selectedMonth,
                year: selectedYear,
                timeOfDay: selectedTimeOfDay,
                status,
                notes: notes.trim() ? notes : "",
            }),
        )

        handleClose()
    }

    // Convert timeOfDay to readable format
    const getTimeLabel = (timeOfDay: string | null) => {
        const timeLabels: Record<string, { label: string; icon: string }> = {
            morning: { label: "Morning", icon: "☀️" },
            afternoon: { label: "Lunchtime", icon: "🌤️" },
            evening: { label: "Evening", icon: "🌙" },
            bedtime: { label: "Bed time", icon: "💤" },
            asNeeded: { label: "As needed", icon: "⏱️" },
        }

        return timeOfDay ? timeLabels[timeOfDay] || { label: timeOfDay, icon: "💊" } : { label: "", icon: "" }
    }

    const { label, icon } = getTimeLabel(selectedTimeOfDay)
    const formattedDate = selectedDay
        ? new Date(Number.parseInt(selectedYear), Number.parseInt(selectedMonth), selectedDay).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        : ""

    return (
        <Dialog open={isCheckInModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Medication Check-In</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {selectedMedication && (
                        <div className="rounded-lg bg-gray-50 p-4">
                            <h3 className="font-medium text-gray-900">{selectedMedication.name}</h3>
                            <div className="mt-1 text-sm text-gray-500">
                                {selectedMedication.dosage} • {selectedMedication.frequency}
                            </div>
                            <div className="mt-3 flex items-center text-sm">
                                <span className="mr-1">{icon}</span>
                                <span className="font-medium">{label}</span>
                                <span className="mx-2">•</span>
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label className="text-base">Status</Label>
                            <RadioGroup
                                value={status}
                                onValueChange={(value) => setStatus(value as "taken" | "not-taken" | "not-reported")}
                                className="mt-3 flex flex-col space-y-3"
                            >
                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                    <RadioGroupItem value="taken" id="taken" className="border-emerald-500 text-emerald-500" />
                                    <Label htmlFor="taken" className="flex flex-1 items-center cursor-pointer">
                                        <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
                                        <div>
                                            <div className="font-medium">Taken</div>
                                            <div className="text-sm text-gray-500">Medication was administered</div>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                    <RadioGroupItem value="not-taken" id="not-taken" className="border-rose-500 text-rose-500" />
                                    <Label htmlFor="not-taken" className="flex flex-1 items-center cursor-pointer">
                                        <XCircle className="mr-2 h-5 w-5 text-rose-500" />
                                        <div>
                                            <div className="font-medium">Not Taken</div>
                                            <div className="text-sm text-gray-500">Medication was not administered</div>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                    <RadioGroupItem value="not-reported" id="not-reported" className="border-gray-500 text-gray-500" />
                                    <Label htmlFor="not-reported" className="flex flex-1 items-center cursor-pointer">
                                        <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
                                        <div>
                                            <div className="font-medium">Not Reported</div>
                                            <div className="text-sm text-gray-500">Status not yet reported</div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any additional notes about this medication"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                            Save Check-In
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
