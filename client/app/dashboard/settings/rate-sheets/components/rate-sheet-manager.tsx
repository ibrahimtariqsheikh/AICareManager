"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Plus, MoreVertical, Pencil, Trash2, DollarSign, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RateSheet } from "@/types/prismaTypes"
import { EmptyState } from "./empty-state"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCreateAgencyRateSheetMutation, useGetAgencyRateSheetsQuery, useDeleteAgencyRateSheetMutation, useUpdateAgencyRateSheetMutation } from "@/state/api"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { RateSheetType } from "@/types/agencyTypes"
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
import { setRateSheets } from "@/state/slices/agencySlice"

interface RateSheetManagerProps {
    staffType: RateSheetType
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    rate: z.string().refine(val => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }, { message: "Rate must be a positive number" }),
})

export function RateSheetManager({ staffType }: RateSheetManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentRateSheet, setCurrentRateSheet] = useState<RateSheet | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const agencyId = useAppSelector((state) => state.user.user?.userInfo?.agencyId)
    const dispatch = useAppDispatch()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rate: "",
        }
    })

    const { data: rateSheets, isLoading, error } = useGetAgencyRateSheetsQuery({
        agencyId: agencyId ?? "",
        staffType: staffType.toLowerCase() as "client" | "careWorker" | "officeStaff"
    }, {
        skip: !agencyId,
    })


    const [createAgencyRateSheet] = useCreateAgencyRateSheetMutation()
    const [updateAgencyRateSheet] = useUpdateAgencyRateSheetMutation()
    const [deleteAgencyRateSheet] = useDeleteAgencyRateSheetMutation()
    const filteredRateSheets = rateSheets?.filter(sheet => sheet.staffType === staffType) || []

    const resetForm = () => {
        form.reset({
            name: "",
            rate: "",
        })
        setCurrentRateSheet(null)
    }

    const handleOpenDialog = (rateSheet?: RateSheet) => {
        if (rateSheet) {
            setCurrentRateSheet(rateSheet)
            form.reset({
                name: rateSheet.name,
                rate: rateSheet.hourlyRate.toString(),
            })
        } else {
            resetForm()
        }
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        resetForm()
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true)
            const rateValue = Number(values.rate)

            // Convert staff type to Prisma enum format
            const serverStaffType = staffType === "CLIENT" ? "CLIENT" :
                staffType === "CARE_WORKER" ? "CARE_WORKER" :
                    "OFFICE_STAFF";

            if (currentRateSheet) {

                agencyId: agencyId ?? "",
                    rateSheetId: currentRateSheet.id,
                        name: values.name,
                            hourlyRate: rateValue,
                                staffType: serverStaffType
            })

            const result = await updateAgencyRateSheet({
                agencyId: agencyId ?? "",
                rateSheetId: currentRateSheet.id,
                name: values.name,
                hourlyRate: rateValue,
                staffType: serverStaffType
            }).unwrap()

            // Update Redux state
            if (rateSheets) {
                dispatch(setRateSheets(rateSheets.map(sheet =>
                    sheet.id === currentRateSheet.id ? result : sheet
                )))
            }
        } else {


            const result = await createAgencyRateSheet({
                agencyId: agencyId ?? "",
                name: values.name,
                hourlyRate: rateValue,
                staffType: serverStaffType
            }).unwrap()

            // Update Redux state
            if (rateSheets) {
                dispatch(setRateSheets([...rateSheets, result]))
            }
        }

        toast.success(`Rate sheet ${currentRateSheet ? 'updated' : 'created'} successfully`)
        handleCloseDialog()
    } catch (error) {
        console.error('Error updating rate sheet:', error)
        toast.error(`Failed to ${currentRateSheet ? 'update' : 'create'} rate sheet`)
    } finally {
        setIsSubmitting(false)
    }
}

const handleOpenDeleteDialog = (rateSheet: RateSheet) => {
    setCurrentRateSheet(rateSheet)
    setIsDeleteDialogOpen(true)
}

const handleDelete = async () => {
    if (currentRateSheet) {
        try {
            await deleteAgencyRateSheet({
                agencyId: agencyId ?? "",
                rateSheetId: currentRateSheet.id
            }).unwrap()

            // Update Redux state by removing the deleted rate sheet
            if (rateSheets) {
                dispatch(setRateSheets(rateSheets.filter(sheet => sheet.id !== currentRateSheet.id)))
            }

            toast.success("Rate sheet deleted successfully")
        } catch (error) {
            toast.error("Failed to delete rate sheet")
        }
    }
    setIsDeleteDialogOpen(false)
    setCurrentRateSheet(null)
}

const getStaffTypeLabel = () => {
    switch (staffType) {
        case "CLIENT":
            return "Client"
        case "CARE_WORKER":
            return "Care Worker"
        case "OFFICE_STAFF":
            return "Office Staff"
    }
}

if (isLoading) {
    return (
        <div className="flex items-center justify-center h-48">
            <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
        </div>
    )
}

return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getStaffTypeLabel()} Rates</h2>
            <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Rate</span>
            </Button>
        </div>

        {error ? (
            <Alert variant="destructive">
                <AlertDescription>
                    {('message' in error)
                        ? error.message
                        : 'An error occurred while fetching rate sheets'}
                </AlertDescription>
            </Alert>
        ) : filteredRateSheets.length === 0 ? (
            <EmptyState
                title={`No ${getStaffTypeLabel()} Rates`}
                description={`Create your first rate sheet for ${getStaffTypeLabel().toLowerCase()}s`}
                icon={<DollarSign className="h-10 w-10 text-muted-foreground" />}
                action={
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rate
                    </Button>
                }
            />
        ) : (
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Rate (CAD/hour)</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRateSheets.map((rateSheet: RateSheet) => (
                            <TableRow key={rateSheet.id}>
                                <TableCell className="font-medium">{rateSheet.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                    >
                                        ${(rateSheet.hourlyRate ?? 0).toFixed(2)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleOpenDialog(rateSheet)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleOpenDeleteDialog(rateSheet)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentRateSheet ? "Edit Rate Sheet" : "Create Rate Sheet"}</DialogTitle>
                    <DialogDescription>
                        {currentRateSheet
                            ? "Update the details for this rate sheet"
                            : `Add a new rate sheet for ${getStaffTypeLabel().toLowerCase()}s`}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rate Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Standard Rate, Premium Care"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hourly Rate (CAD)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="pl-7"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : currentRateSheet ? "Save Changes" : "Create Rate Sheet"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Rate Sheet</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this rate sheet? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
)
}
