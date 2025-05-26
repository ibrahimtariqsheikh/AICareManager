"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"

interface NewExpenseFormProps {
    onClose: () => void
}

export function NewExpenseForm({ onClose }: NewExpenseFormProps) {
    const [employee, setEmployee] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [date, setDate] = useState("")
    const [receipt, setReceipt] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <CustomSelect
                        value={employee}
                        onChange={setEmployee}
                        placeholder="Select employee"
                        options={[
                            { value: "sarah", label: "Sarah Wilson" },
                            { value: "mike", label: "Mike Johnson" },
                            { value: "lisa", label: "Lisa Chen" }
                        ]}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <CustomSelect
                        value={category}
                        onChange={setCategory}
                        placeholder="Select category"
                        options={[
                            { value: "travel", label: "Travel" },
                            { value: "office", label: "Office Supplies" },
                            { value: "training", label: "Training" },
                            { value: "other", label: "Other" }
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <CustomInput
                    id="description"
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter expense description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <CustomInput
                        id="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={setAmount}
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <CustomInput
                        id="date"
                        type="date"
                        value={date}
                        onChange={setDate}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="receipt">Receipt</Label>
                <CustomInput
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(value) => setReceipt(value as unknown as File)}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    Create Expense
                </Button>
            </div>
        </form>
    )
} 