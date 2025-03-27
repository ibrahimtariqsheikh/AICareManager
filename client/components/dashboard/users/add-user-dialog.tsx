"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"

// Form schema
const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
})

interface AddUserDialogProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    onAddUser: (email: string, role: string) => void
    isLoading: boolean
    userType: string
}

export function AddUserDialog({ isOpen, setIsOpen, onAddUser, isLoading, userType }: AddUserDialogProps) {
    // Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // Get user type label
    const getUserTypeLabel = () => {
        switch (userType) {
            case "CLIENT":
                return "Client"
            case "CARE_WORKER":
                return "Care Worker"
            case "OFFICE_STAFF":
                return "Office Staff"
            default:
                return "User"
        }
    }

    // Update the onSubmit function to provide better feedback
    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log("Submitting invitation:", { email: values.email, role: userType })
            await onAddUser(values.email, userType)
            form.reset() // Reset the form after successful submission
        } catch (error) {
            console.error("Error submitting invitation:", error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add {getUserTypeLabel()}</DialogTitle>
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Invitation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

