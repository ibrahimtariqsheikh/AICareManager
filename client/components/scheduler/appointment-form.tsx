import { z } from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "../../lib/utils"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form"

const formSchema = z.object({
    clientId: z.string({
        required_error: "Please select a client",
    }),
    userId: z.string({
        required_error: "Please select a staff member",
    }),
    date: z.date({
        required_error: "Please select a date",
    }),
    startTime: z.string({
        required_error: "Please select a start time",
    }),
    endTime: z.string({
        required_error: "Please select an end time",
    }),
    type: z.enum(["WEEKLY_CHECKUP", "APPOINTMENT", "HOME_VISIT", "OTHER"], {
        required_error: "Please select an appointment type",
    }),
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"], {
        required_error: "Please select a status",
    }),
    notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AppointmentFormProps {
    isOpen: boolean
    onClose: () => void
    event?: any
    isNew?: boolean
}

export function AppointmentForm({ isOpen, onClose, event, isNew = false }: AppointmentFormProps) {
    const [clients, setClients] = useState<any[]>([])
    const [staff, setStaff] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientId: "",
            userId: "",
            date: new Date(),
            startTime: "09:00",
            endTime: "10:00",
            type: "APPOINTMENT",
            status: "PENDING",
            notes: "",
        },
    })

    useEffect(() => {
        // Fetch clients and staff
        const fetchData = async () => {
            try {
                // In a real app, these would be API calls
                // For now, we'll use mock data
                await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

                const mockClients = [
                    { id: "client-1", name: "John Doe" },
                    { id: "client-2", name: "Jane Smith" },
                    { id: "client-3", name: "Robert Johnson" },
                    { id: "client-4", name: "Emily Davis" },
                    { id: "client-5", name: "Michael Brown" },
                ]

                const mockStaff = [
                    { id: "staff-1", name: "Dr. Sarah Wilson" },
                    { id: "staff-2", name: "Nurse David Thompson" },
                    { id: "staff-3", name: "Dr. Lisa Martinez" },
                    { id: "staff-4", name: "Therapist James Taylor" },
                ]

                setClients(mockClients)
                setStaff(mockStaff)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Failed to load form data. Please try again.")
            }
        }

        fetchData()

        // If editing an existing event, populate the form
        if (event) {
            const startDate = new Date(event.start)
            const endDate = new Date(event.end)

            form.reset({
                clientId: event.clientId,
                userId: event.resourceId,
                date: startDate,
                startTime: format(startDate, "HH:mm"),
                endTime: format(endDate, "HH:mm"),
                type: event.type,
                status: event.status,
                notes: event.notes || "",
            })
        }
    }, [event, form, toast])

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)

        try {
            // Combine date and time
            const [startHour, startMinute] = data.startTime.split(":").map(Number)
            const [endHour, endMinute] = data.endTime.split(":").map(Number)

            const startDateTime = new Date(data.date)
            startDateTime.setHours(startHour, startMinute)

            const endDateTime = new Date(data.date)
            endDateTime.setHours(endHour, endMinute)

            // Prepare the appointment data
            const appointmentData = {
                id: event?.id || `new-${Date.now()}`,
                clientId: data.clientId,
                userId: data.userId,
                date: data.date,
                shiftStart: startDateTime,
                shiftEnd: endDateTime,
                status: data.status,
                type: data.type,
                notes: data.notes,
            }

            // In a real app, this would be an API call to save the appointment
            console.log("Saving appointment:", appointmentData)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

            toast.success(`Successfully ${isNew ? "created" : "updated"} the appointment.`)

            onClose()
        } catch (error) {
            console.error("Failed to save appointment:", error)
            toast.error(`Failed to ${isNew ? "create" : "update"} the appointment. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isNew ? "Create New Appointment" : "Edit Appointment"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="clientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a client" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {clients.map((client) => (
                                                    <SelectItem key={client.id} value={client.id}>
                                                        {client.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Staff Member</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a staff member" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {staff.map((staffMember) => (
                                                    <SelectItem key={staffMember.id} value={staffMember.id}>
                                                        {staffMember.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <div>
                                                    TEST
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Appointment Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WEEKLY_CHECKUP">Weekly Checkup</SelectItem>
                                                <SelectItem value="APPOINTMENT">Appointment</SelectItem>
                                                <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELED">Canceled</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        <Textarea placeholder="Add any additional notes here..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormDescription>Optional notes about the appointment</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        {isNew ? "Creating..." : "Updating..."}
                                    </>
                                ) : (
                                    <>{isNew ? "Create Appointment" : "Update Appointment"}</>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

