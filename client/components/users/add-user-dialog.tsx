"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Users, UserPlus, Briefcase } from "lucide-react"

// Form schema
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.string().min(1, { message: "Please select a role" }),
})

interface AddUserDialogProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    onAddUser: (email: string, role: string) => void
    isLoading: boolean
    userType?: string
}

export function AddUserDialog({ isOpen, setIsOpen, onAddUser, isLoading, userType }: AddUserDialogProps) {
    // Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: userType || "CLIENT",
        },
    })

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await onAddUser(values.email, values.role)
            form.reset() // Reset the form after successful submission
        } catch (error) {
            console.error("Error submitting invitation:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Send an invitation to join your organization. They will receive an email with instructions.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>User Role</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                                                <RadioGroupItem value="CLIENT" id="client" />
                                                <Label htmlFor="client" className="flex items-center gap-2 font-normal cursor-pointer">
                                                    <div className="p-1 rounded-full bg-blue-50">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Client</p>
                                                        <p className="text-sm text-gray-500">Can view their care plans and schedules</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                                                <RadioGroupItem value="CARE_WORKER" id="care-worker" />
                                                <Label htmlFor="care-worker" className="flex items-center gap-2 font-normal cursor-pointer">
                                                    <div className="p-1 rounded-full bg-green-50">
                                                        <UserPlus className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Care Worker</p>
                                                        <p className="text-sm text-gray-500">Can manage client care and schedules</p>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                                                <RadioGroupItem value="OFFICE_STAFF" id="office-staff" />
                                                <Label htmlFor="office-staff" className="flex items-center gap-2 font-normal cursor-pointer">
                                                    <div className="p-1 rounded-full bg-purple-50">
                                                        <Briefcase className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Office Staff</p>
                                                        <p className="text-sm text-gray-500">Can manage administrative tasks</p>
                                                    </div>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-gray-800">
                                {isLoading ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

