"use client"


import { useAppDispatch, useAppSelector } from "@/state/redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addMedicationLog, closeCheckInModal } from "@/state/slices/medicationSlice"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { MedicationTime, User } from "@/types/prismaTypes"
import { useCheckInMedicationMutation } from "@/state/api"
import { toast } from "sonner"

const formSchema = z.object({
    status: z.enum(["TAKEN", "NOT_TAKEN", "NOT_REPORTED"]),
    notes: z.string().optional(),
})

interface CheckInModalProps {
    user: User
}

export function CheckInModal({ user }: CheckInModalProps) {
    const dispatch = useAppDispatch()
    const {
        isCheckInModalOpen = false,
        selectedMedicationId = null,
        selectedTimeOfDay = null,
        selectedDay = null,
        medications = [],
    } = useAppSelector((state) => state.medication) || {}

    const [checkInMedication] = useCheckInMedicationMutation()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "TAKEN",
            notes: "",
        },
    })

    const selectedMedication = medications.find((med) => med.id === selectedMedicationId)

    const handleClose = () => {
        dispatch(closeCheckInModal())
        form.reset()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!selectedMedicationId || !selectedTimeOfDay || selectedDay === null || !user?.id) {
            toast.error("Missing required information for medication check-in")
            return
        }

        try {
            await checkInMedication({
                medicationId: selectedMedicationId,
                userId: user.id,
                data: {
                    date: new Date(Date.now()).toISOString(),
                    time: selectedTimeOfDay.toUpperCase() as MedicationTime,
                    status: values.status,
                    notes: values.notes || null,
                }
            }).unwrap()


            dispatch(addMedicationLog({
                medicationId: selectedMedicationId,
                userId: user.id,
                data: {
                    date: new Date(Date.now()).toISOString(),
                    time: selectedTimeOfDay.toUpperCase() as MedicationTime,
                    status: values.status,
                    notes: values.notes || null,
                }
            }))

            toast.success("Medication check-in recorded successfully")
            handleClose()
        } catch (error) {
            toast.error("Failed to record medication check-in", {
                description: error instanceof Error ? error.message : "An unknown error occurred",
            })
            console.error("Failed to check in medication:", error)
        }
    }






    return (
        <Dialog open={isCheckInModalOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Medication Check-In</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        {selectedMedication && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="font-medium text-gray-900">{selectedMedication.name}</h3>
                                <div className="mt-1 text-sm text-gray-500">
                                    {selectedMedication.dosage} • {selectedMedication.frequency}
                                </div>

                            </div>
                        )}

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Status</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="mt-3 flex flex-col space-y-3"
                                            >
                                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                                    <RadioGroupItem value="TAKEN" id="TAKEN" className="border-emerald-500 text-emerald-500" />
                                                    <Label htmlFor="TAKEN" className="flex flex-1 items-center cursor-pointer">
                                                        <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
                                                        <div>
                                                            <div className="font-medium">Taken</div>
                                                            <div className="text-sm text-gray-500">Medication was administered</div>
                                                        </div>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                                    <RadioGroupItem value="NOT_TAKEN" id="NOT_TAKEN" className="border-rose-500 text-rose-500" />
                                                    <Label htmlFor="NOT_TAKEN" className="flex flex-1 items-center cursor-pointer">
                                                        <XCircle className="mr-2 h-5 w-5 text-rose-500" />
                                                        <div>
                                                            <div className="font-medium">Not Taken</div>
                                                            <div className="text-sm text-gray-500">Medication was not administered</div>
                                                        </div>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                                    <RadioGroupItem value="NOT_REPORTED" id="NOT_REPORTED" className="border-gray-500 text-gray-500" />
                                                    <Label htmlFor="NOT_REPORTED" className="flex flex-1 items-center cursor-pointer">
                                                        <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
                                                        <div>
                                                            <div className="font-medium">Not Reported</div>
                                                            <div className="text-sm text-gray-500">Status not yet reported</div>
                                                        </div>
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
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Add any additional notes about this medication"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className=" bg-emerald-500 text-white hover:bg-emerald-600">
                                Save Check-In
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}