"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { MyCustomDateRange } from "./my-custom-date-range"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { addExpense } from "@/state/slices/expensesSlice"
import { Building2, File, Plane, Users, UserCircle, Briefcase, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCreateExpenseMutation } from "@/state/api"

// Define types locally since we can't access the prisma types
enum ExpenseCategory {
    TRAVEL = "TRAVEL",
    MEALS = "MEALS",
    LODGING = "LODGING",
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
    TRAINING = "TRAINING",
    OTHER = "OTHER"
}

enum ExpenseAssociatedEntity {
    CLIENT = "CLIENT",
    CAREWORKER = "CAREWORKER",
    OFFICE_STAFF = "OFFICE_STAFF",
    COMPANY = "COMPANY"
}

interface NewExpenseFormProps {
    onClose: () => void
}

export function NewExpenseForm({ onClose }: NewExpenseFormProps) {
    const dispatch = useAppDispatch()
    const [type, setType] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
    const [selectedEntity, setSelectedEntity] = useState("")
    const [entityType, setEntityType] = useState("client")

    const [createExpense, { isLoading: isCreateExpenseLoading }] = useCreateExpenseMutation()
    const agencyId = useAppSelector(state => state.user.user.userInfo?.agencyId) || ""

    const expenseCategories = Object.values(ExpenseCategory).map(category => ({
        icon: category === "TRAVEL" ? <Plane /> :
            category === "MEALS" ? <Utensils /> :
                category === "LODGING" ? <Building2 /> :
                    <File />,
        value: category,
        label: category
    }))


    const typeOptions = [
        { value: "company", label: "Company", icon: <Building2 className="h-4 w-4" /> },
        { value: "client", label: "Client", icon: <Users className="h-4 w-4" /> },
        { value: "careworker", label: "Careworker", icon: <UserCircle className="h-4 w-4" /> },
        { value: "office-staff", label: "Office Staff", icon: <Briefcase className="h-4 w-4" /> }
    ]

    const entityTypeOptions = [
        { value: "client", label: "Client", icon: <Users className="h-4 w-4" /> },
        { value: "careworker", label: "Careworker", icon: <UserCircle className="h-4 w-4" /> },
        { value: "office-staff", label: "Office Staff", icon: <Briefcase className="h-4 w-4" /> }
    ]

    const clients = useAppSelector(state => state.user.clients)
    const careworkers = useAppSelector(state => state.user.careWorkers)
    const officeStaff = useAppSelector(state => state.user.officeStaff)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!category || !type || !amount || !description || !dateRange?.from) {
            console.log('Missing required fields:', { category, type, amount, description, dateRange })
            return
        }

        try {
            const expenseData = {
                type: type.toUpperCase() as any,
                associatedEntity: type === "company" ? entityType.toUpperCase().replace('-', '_') as ExpenseAssociatedEntity : entityType.toUpperCase().replace('-', '_') as ExpenseAssociatedEntity,
                category: category as ExpenseCategory,
                description: description || "",
                amount: parseFloat(amount),
                date: dateRange.from,
                agencyId,
                userId: selectedEntity || agencyId
            }

            console.log('Submitting expense data:', expenseData)
            const response = await createExpense(expenseData).unwrap()
            console.log("Raw API Response:", response)

            // Handle both possible response formats
            const expense = response.expense || response

            if (expense && expense.id) {
                console.log('Dispatching expense to Redux:', expense)
                // Ensure the expense has all required fields
                const expenseToDispatch = {
                    ...expense,
                    type: expense.type || expenseData.type,
                    associatedEntity: expense.associatedEntity || expenseData.associatedEntity,
                    category: expense.category || expenseData.category,
                    description: expense.description || expenseData.description,
                    amount: expense.amount || expenseData.amount,
                    date: expense.date || expenseData.date,
                    agencyId: expense.agencyId || expenseData.agencyId,
                    userId: expense.userId || expenseData.userId
                }
                console.log("EXPENSE TO DISPATCH", expenseToDispatch)
                dispatch(addExpense(expenseToDispatch))
                onClose()
            } else {
                console.error('Invalid expense data received from server:', response)
            }
        } catch (error) {
            console.error('Failed to create expense:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Expense Type</Label>
                <div className="grid grid-cols-4 gap-2">
                    {typeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setType(option.value)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 rounded-lg border p-3 hover:bg-muted/50",
                                type === option.value && "border-primary bg-primary/5"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                option.value === "company" && "bg-blue-100 text-blue-600",
                                option.value === "client" && "bg-green-100 text-green-600",
                                option.value === "careworker" && "bg-purple-100 text-purple-600",
                                option.value === "office-staff" && "bg-orange-100 text-orange-600",
                                type === option.value && "bg-primary/5"
                            )}>

                                {option.icon}

                            </div>
                            <span className="text-sm font-medium">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="entityType">Associated Entity</Label>
                    <CustomSelect
                        id="entityType"
                        value={entityType}
                        onChange={setEntityType}
                        placeholder="Select entity type"
                        options={entityTypeOptions}
                        variant="default"
                        selectSize="default"
                    />
                </div>

                {entityType && (
                    <div className="space-y-2">
                        <Label htmlFor="entity">Select {entityType === "client" ? "Client" : entityType === "careworker" ? "Careworker" : "Office Staff"}</Label>
                        <CustomSelect
                            id="entity"
                            value={selectedEntity}
                            onChange={setSelectedEntity}
                            placeholder={`Select ${entityType === "client" ? "client" : entityType === "careworker" ? "careworker" : "office staff"}`}
                            options={
                                entityType === "client"
                                    ? clients.map(client => ({ value: client.id, label: client.fullName }))
                                    : entityType === "careworker"
                                        ? careworkers.map(careworker => ({ value: careworker.id, label: careworker.fullName }))
                                        : officeStaff.map(staff => ({ value: staff.id, label: staff.fullName }))
                            }
                            variant="default"
                            selectSize="default"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <CustomSelect
                    id="category"
                    value={category}
                    onChange={setCategory}
                    placeholder="Select category"
                    options={expenseCategories}
                    variant="default"
                    selectSize="default"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <CustomInput
                    id="description"
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter expense description"
                    variant="default"
                    inputSize="default"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <CustomInput
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={setAmount}
                        placeholder="0.00"
                        variant="default"
                        inputSize="default"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="date">Date <span className="text-muted-foreground text-xs">(Required)</span></Label>
                    <MyCustomDateRange
                        onRangeChange={setDateRange}
                        initialDateRange={dateRange}
                        placeholder="Select expense date"
                        position="top"
                        oneDate={true}
                    />
                    {!dateRange?.from && (
                        <p className="text-sm text-destructive">Please select a date</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isCreateExpenseLoading || !category || !type || !amount || !description || !dateRange?.from}
                >
                    {isCreateExpenseLoading ? "Creating..." : "Create Expense"}
                </Button>
            </div>
        </form>
    )
} 