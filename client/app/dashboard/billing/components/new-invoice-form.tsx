"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

// Mock clients data
const mockClients = [
    { id: "client1", name: "John Doe" },
    { id: "client2", name: "Jane Smith" },
    { id: "client3", name: "Bob Johnson" },
]

interface NewInvoiceFormProps {
    onClose: () => void
}

export function NewInvoiceForm({ onClose }: NewInvoiceFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        clientId: "",
        amount: "",
        description: "",
        dueDate: new Date(),
        paymentMethod: "ACH",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    dueDate: format(formData.dueDate, "yyyy-MM-dd"),
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to create invoice")
            }

            toast({
                title: "Success",
                description: "Invoice created successfully",
            })

            router.refresh()
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create invoice. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>
                    Fill in the details below to create a new invoice
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientId">Client</Label>
                        <Select
                            value={formData.clientId}
                            onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                        >
                            <SelectTrigger id="clientId">
                                <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockClients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter invoice description"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <DatePicker
                            date={formData.dueDate}
                            setDate={(date: Date) => setFormData({ ...formData, dueDate: date })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                        >
                            <SelectTrigger id="paymentMethod">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACH">ACH</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Paper Check">Paper Check</SelectItem>
                                <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Invoice"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
} 