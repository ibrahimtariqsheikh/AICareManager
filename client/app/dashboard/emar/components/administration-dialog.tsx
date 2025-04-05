"use client"

import type React from "react"

import { useState } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface AdministrationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    medication?: any
}

export function AdministrationDialog({ open, onOpenChange, medication }: AdministrationDialogProps) {
    const [status, setStatus] = useState<"given" | "not_given" | "refused">("given")
    const [notes, setNotes] = useState("")
    const [administeredBy, setAdministeredBy] = useState("")
    const [administeredTime, setAdministeredTime] = useState(new Date().toISOString().substring(0, 16))
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Medication administration recorded successfully")
            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to record administration")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Medication Administration</DialogTitle>
                    <DialogDescription>
                        {medication
                            ? `Record administration details for ${medication.name} ${medication.dosage}`
                            : "Record medication administration"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label>Administration Status</Label>
                        <RadioGroup value={status} onValueChange={setStatus as any} className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                                <RadioGroupItem value="given" id="given" />
                                <Label htmlFor="given" className="flex items-center cursor-pointer">
                                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                                    <div>
                                        <div>Given</div>
                                        <div className="text-sm text-muted-foreground">Medication was administered as prescribed</div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                                <RadioGroupItem value="not_given" id="not_given" />
                                <Label htmlFor="not_given" className="flex items-center cursor-pointer">
                                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                                    <div>
                                        <div>Not Given</div>
                                        <div className="text-sm text-muted-foreground">Medication was not administered</div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                                <RadioGroupItem value="refused" id="refused" />
                                <Label htmlFor="refused" className="flex items-center cursor-pointer">
                                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                                    <div>
                                        <div>Refused</div>
                                        <div className="text-sm text-muted-foreground">Patient refused to take medication</div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="administered_by">Administered By</Label>
                            <Input
                                id="administered_by"
                                value={administeredBy}
                                onChange={(e) => setAdministeredBy(e.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="administered_time">Time</Label>
                            <Input
                                id="administered_time"
                                type="datetime-local"
                                value={administeredTime}
                                onChange={(e) => setAdministeredTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any additional notes about this administration..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting ? "Recording..." : "Record Administration"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

