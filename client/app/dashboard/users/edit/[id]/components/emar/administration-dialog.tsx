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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { setAdministrationDialogOpen, recordAdministration } from "@/state/slices/medicationSlice"
import { useAppDispatch, useAppSelector } from "@/state/redux"

const formSchema = z.object({
    status: z.enum(["given", "not_given", "refused"]),
    administeredBy: z.string().min(1, "Administrator name is required"),
    administeredTime: z.string().min(1, "Administration time is required"),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AdministrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    medication?: any;
}

export function AdministrationDialog({ open, onOpenChange, medication }: AdministrationDialogProps) {
    const dispatch = useAppDispatch()
    const selectedMedication = useAppSelector(state => state.medication.selectedMedication)
    const currentMedication = medication || selectedMedication

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "given",
            administeredBy: "",
            administeredTime: new Date().toISOString().slice(0, 16),
            notes: "",
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                status: "given",
                administeredBy: "",
                administeredTime: new Date().toISOString().slice(0, 16),
                notes: "",
            })
        }
    }, [open, form])

    const onSubmit = async (values: FormValues) => {
        try {
            if (!currentMedication) {
                toast.error("No medication selected")
                return
            }

            await dispatch(recordAdministration({
                medicationId: currentMedication.id,
                scheduledTime: currentMedication.schedule,
                ...values,
                administeredTime: new Date(values.administeredTime).toISOString(),
                notes: values.notes || "",
            }))

            toast.success("Administration recorded successfully")
            onOpenChange(false)
        } catch (error) {
            console.error('Error recording administration:', error)
            toast.error("Failed to record administration")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Medication Administration</DialogTitle>
                    <DialogDescription>
                        Record the administration details for {currentMedication?.name}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Administration Status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="given" id="given" />
                                                <Label htmlFor="given" className="flex items-center">
                                                    <CheckCircle2 className="w-4 h-4 mr-2 text-slate-600" />
                                                    Given
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="not_given" id="not_given" />
                                                <Label htmlFor="not_given" className="flex items-center">
                                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                                    Not Given
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="refused" id="refused" />
                                                <Label htmlFor="refused" className="flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                                                    Refused
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="administeredBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Administered By</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter administrator name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="administeredTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Administration Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional notes about the administration..."
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
                                {form.formState.isSubmitting ? "Recording..." : "Record Administration"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 