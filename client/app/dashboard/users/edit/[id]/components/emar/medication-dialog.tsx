"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import {
    setMedicationDialogOpen,
    addMedication,
    updateMedication
} from "@/state/slices/medicationSlice"

const formSchema = z.object({
    name: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    instructions: z.string().min(1, "Instructions are required"),
    reason: z.string().min(1, "Reason is required"),
    route: z.string(),
    frequency: z.string(),
    times: z.array(z.string()),
    days: z.array(z.string()),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface MedicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    medication?: any;
}

export function MedicationDialog({ open, onOpenChange, medication }: MedicationDialogProps) {
    const dispatch = useAppDispatch()
    const selectedMedication = useAppSelector(state => state.medication.selectedMedication)
    const currentMedication = medication || selectedMedication

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            dosage: "",
            instructions: "",
            reason: "",
            route: "oral",
            frequency: "daily",
            times: ["08:00"],
            days: ["monday", "wednesday", "friday"],
            notes: "",
        },
    })

    // Initialize form when medication changes
    useEffect(() => {
        if (currentMedication) {
            form.reset({
                name: currentMedication.name,
                dosage: currentMedication.dosage,
                instructions: currentMedication.instructions,
                reason: currentMedication.reason,
                route: currentMedication.route,
                frequency: currentMedication.frequency,
                times: currentMedication.times,
                days: currentMedication.days,
                notes: currentMedication.notes || "",
            })
        } else {
            form.reset({
                name: "",
                dosage: "",
                instructions: "",
                reason: "",
                route: "oral",
                frequency: "daily",
                times: ["08:00"],
                days: ["monday", "wednesday", "friday"],
                notes: "",
            })
        }
    }, [currentMedication, open, form])

    const onSubmit = async (values: FormValues) => {
        try {
            // Calculate schedule string from times
            const schedule = values.times
                .map(time => {
                    const [hours, minutes] = time.split(':').map(Number)
                    return format(new Date().setHours(hours, minutes), 'h:mma')
                })
                .join(', ')

            if (currentMedication) {
                await dispatch(updateMedication({
                    ...currentMedication,
                    ...values,
                    schedule
                }))
                toast.success("Medication updated successfully")
            } else {
                await dispatch(addMedication({
                    ...values,
                    schedule
                }))
                toast.success("Medication added successfully")
            }

            // Only close the dialog after successful submission
            onOpenChange(false)
        } catch (error) {
            console.error('Error saving medication:', error)
            toast.error("Failed to save medication")
            // Don't close the dialog on error
        }
    }

    const addTime = () => {
        const currentTimes = form.getValues("times")
        form.setValue("times", [...currentTimes, ""])
    }

    const updateTime = (index: number, value: string) => {
        const currentTimes = form.getValues("times")
        currentTimes[index] = value
        form.setValue("times", currentTimes)
    }

    const removeTime = (index: number) => {
        const currentTimes = form.getValues("times")
        form.setValue("times", currentTimes.filter((_, i) => i !== index))
    }

    const toggleDay = (day: string) => {
        const currentDays = form.getValues("days")
        if (currentDays.includes(day)) {
            form.setValue("days", currentDays.filter(d => d !== day))
        } else {
            form.setValue("days", [...currentDays, day])
        }
    }

    const format = (date: number, formatStr: string) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date(date))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{currentMedication ? "Edit Medication" : "Add New Medication"}</DialogTitle>
                    <DialogDescription>
                        {currentMedication ? "Update the medication details below." : "Enter the details of the new medication."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medication Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Hydrocortisone"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dosage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dosage</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 5mg"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Take 1 Tab by Mouth Twice Daily"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for Medication</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Hypertension"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="route"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Administration Route</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select route" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="frequency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frequency</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Administration Times</Label>
                            {form.getValues("times").map((time, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) => updateTime(index, e.target.value)}
                                        className="flex-1"
                                    />
                                    {form.getValues("times").length > 1 && (
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
                                        <Checkbox
                                            id={day}
                                            checked={form.getValues("days").includes(day)}
                                            onCheckedChange={() => toggleDay(day)}
                                        />
                                        <Label htmlFor={day} className="capitalize">
                                            {day}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional information about this medication..."
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-slate-600 hover:bg-slate-700"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Saving..." : selectedMedication ? "Update Medication" : "Add Medication"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 