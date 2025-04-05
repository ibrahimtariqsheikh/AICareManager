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

export function AdministrationDialog() {
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector(state => state.medication.isAdministrationDialogOpen)
    const selectedMedication = useAppSelector(state => state.medication.selectedMedication)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "given",
            administeredBy: "",
            administeredTime: new Date().toISOString().substring(0, 16),
            notes: "",
        },
    })

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            form.reset({
                status: "given",
                administeredBy: "",
                administeredTime: new Date().toISOString().substring(0, 16),
                notes: "",
            })
        }
    }, [isOpen, form])

    const onSubmit = async (values: FormValues) => {
        try {
            if (selectedMedication) {
                dispatch(recordAdministration({
                    medicationId: selectedMedication.id,
                    status: values.status,
                    administeredBy: values.administeredBy,
                    administeredTime: values.administeredTime,
                    notes: values.notes || "",
                    scheduledTime: new Date().toString()
                }))
                toast.success("Medication administration recorded successfully")
                dispatch(setAdministrationDialogOpen(false))
            }
        } catch (error) {
            toast.error("Failed to record administration")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => dispatch(setAdministrationDialogOpen(open))}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Medication Administration</DialogTitle>
                    <DialogDescription>
                        {selectedMedication
                            ? `Record administration details for ${selectedMedication.name} ${selectedMedication.dosage}`
                            : "Record medication administration"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Administration Status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                            <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                                                <RadioGroupItem value="given" id="given" />
                                                <Label htmlFor="given" className="flex items-center cursor-pointer">
                                                    <CheckCircle2 className="h-5 w-5 mr-2 text-slate-500" />
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="administeredBy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Administered By</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your name"
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
                                        <FormLabel>Time</FormLabel>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional notes about this administration..."
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
                                onClick={() => dispatch(setAdministrationDialogOpen(false))}
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
