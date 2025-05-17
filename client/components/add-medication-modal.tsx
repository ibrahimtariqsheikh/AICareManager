"use client"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addMedication, closeAddMedicationModal } from "@/state/slices/medicationSlice"
import { useCreateMedicationMutation } from "@/state/api"
import { Pill, Sun, Cloud, Sunset, Moon, Clock } from "lucide-react"
import type { User } from "@/types/prismaTypes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    instructions: z.string().optional(),
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
    bedtime: z.boolean().default(false),
    asNeeded: z.boolean().default(false),
})

interface AddMedicationModalProps {
    user: User
}

export function AddMedicationModal({ user }: AddMedicationModalProps) {
    const dispatch = useAppDispatch()
    const { isAddMedicationModalOpen = false } = useAppSelector((state) => state.medication) || {}
    const [createMedication] = useCreateMedicationMutation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            dosage: "",
            frequency: "",
            instructions: "",
            morning: false,
            afternoon: false,
            evening: false,
            bedtime: false,
            asNeeded: false,
        },
    })

    const handleClose = () => {
        dispatch(closeAddMedicationModal())
        form.reset()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user || !user.id) {
            toast.error("Cannot add medication: missing user information")
            return
        }

        try {
            dispatch(addMedication(values as any))
            const response = await createMedication({
                userId: user.id,
                data: values,
            }).unwrap()

            if (response) {
                toast.success("Medication added successfully")
                handleClose()
            }
        } catch (error) {
            toast.error("Failed to add medication", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            })
            console.error("Failed to create medication:", error)
        }
    }

    // Define administration time options with icons and colors
    const administrationTimes = [
        {
            name: "morning",
            label: "Morning",
            icon: Sun,
            color: "text-amber-500",
            bgColor: "bg-amber-100",
            borderColor: "border-amber-500",
        },
        {
            name: "afternoon",
            label: "Afternoon",
            icon: Cloud,
            color: "text-sky-500",
            bgColor: "bg-sky-100",
            borderColor: "border-sky-500",
        },
        {
            name: "evening",
            label: "Evening",
            icon: Sunset,
            color: "text-orange-500",
            bgColor: "bg-orange-100",
            borderColor: "border-orange-500",
        },
        {
            name: "bedtime",
            label: "Bedtime",
            icon: Moon,
            color: "text-indigo-500",
            bgColor: "bg-indigo-100",
            borderColor: "border-indigo-500",
        },
        {
            name: "asNeeded",
            label: "As Needed",
            icon: Clock,
            color: "text-gray-500",
            bgColor: "bg-gray-100",
            borderColor: "border-gray-500",
        },
    ]

    return (
        <Dialog open={isAddMedicationModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold flex items-center">
                        <Pill className="mr-2 w-4 h-4" />
                        Add New Medication
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medication Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter medication name" {...field} />
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
                                            <Input placeholder="Enter dosage (e.g., 500mg)" {...field} />
                                        </FormControl>
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
                                        <FormControl>
                                            <Input placeholder="Enter frequency (e.g., Once daily)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="instructions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructions (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter any special instructions" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3">
                                <FormLabel>Administration Times</FormLabel>
                                <div className="flex w-full justify-between gap-2 bg-muted/30 p-2 rounded-lg">
                                    {administrationTimes.map(({ name, label, icon: Icon, color, bgColor, borderColor }) => (
                                        <FormField
                                            key={name}
                                            control={form.control}
                                            name={name as keyof typeof formSchema.shape}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => field.onChange(!field.value)}
                                                            className={cn(
                                                                "w-full h-full flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200",
                                                                field.value
                                                                    ? `${bgColor} ring-2 ${borderColor} shadow-sm`
                                                                    : "bg-transparent hover:bg-background",
                                                            )}
                                                        >
                                                            <Icon
                                                                className={cn(
                                                                    "h-5 w-5 mb-1 transition-transform",
                                                                    field.value ? `${color} scale-110` : "text-muted-foreground",
                                                                )}
                                                            />
                                                            <span
                                                                className={cn(
                                                                    "text-[10px] font-medium leading-tight text-center",
                                                                    field.value ? "text-foreground" : "text-muted-foreground",
                                                                )}
                                                            >
                                                                {label}
                                                            </span>
                                                        </button>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-emerald-500 text-white hover:bg-emerald-600">
                                Add Medication
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
