"use client"

import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { addMedication, closeAddMedicationModal } from "@/state/slices/medicationSlice"
import { useCreateMedicationMutation } from "@/state/api"
import { Pill } from "lucide-react"
import { User } from "@/types/prismaTypes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

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
    const { isAddMedicationModalOpen } = useAppSelector((state) => state.medication)
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
        try {
            dispatch(addMedication(values))
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

    return (
        <Dialog open={isAddMedicationModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <Pill className="mr-2 w-5 h-5" />
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
                                            <Textarea
                                                placeholder="Enter any special instructions"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-2">
                                <FormLabel>Administration Times</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    {["morning", "afternoon", "evening", "bedtime", "asNeeded"].map((time) => (
                                        <FormField
                                            key={time}
                                            control={form.control}
                                            name={time as keyof typeof formSchema.shape}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value as boolean}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {time.charAt(0).toUpperCase() + time.slice(1)}
                                                    </FormLabel>
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
                            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                                Add Medication
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 