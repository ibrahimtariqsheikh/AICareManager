"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from "date-fns"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setSelectedMedication, setAdministrationDialogOpen } from "@/state/slices/medicationSlice"

export function MedicationTable() {
    const dispatch = useAppDispatch()
    const medications = useAppSelector(state => state.medication.medications)
    const administrations = useAppSelector(state => state.medication.administrations)
    const currentDate = new Date()

    // Create scheduled medications from the medications and administrations
    const scheduledMedications = medications.flatMap(med => {
        return med.times.map(time => {
            const [hours, minutes] = time.split(':').map(Number)
            const scheduledTime = new Date(currentDate)
            scheduledTime.setHours(hours, minutes, 0)

            // Find if there's an administration for this medication and time
            const administration = administrations.find(adm =>
                adm.medicationId === med.id &&
                new Date(adm.scheduledTime).getHours() === hours &&
                new Date(adm.scheduledTime).getMinutes() === minutes
            )

            return {
                id: `${med.id}-${time}`,
                medicationId: med.id,
                name: med.name,
                dosage: med.dosage,
                instructions: med.instructions,
                scheduledTime,
                status: administration?.status || "pending"
            }
        })
    }).sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "given":
                return <Badge className="bg-slate-100 text-slate-800">Given</Badge>
            case "not_given":
                return <Badge className="bg-red-100 text-red-800">Not Given</Badge>
            case "refused":
                return <Badge className="bg-amber-100 text-amber-800">Refused</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "given":
                return <CheckCircle className="w-4 h-4 text-slate-600" />
            case "not_given":
                return <AlertCircle className="w-4 h-4 text-red-500" />
            case "refused":
                return <AlertCircle className="w-4 h-4 text-amber-500" />
            default:
                return <Clock className="w-4 h-4 text-gray-500" />
        }
    }

    const handleAdminister = (medicationId: string) => {
        const medication = medications.find(m => m.id === medicationId)
        if (medication) {
            dispatch(setSelectedMedication(medication))
            dispatch(setAdministrationDialogOpen(true))
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Instructions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scheduledMedications.map((med) => (
                        <TableRow key={med.id}>
                            <TableCell>
                                {format(med.scheduledTime, 'h:mm a')}
                            </TableCell>
                            <TableCell>{med.name}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.instructions}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(med.status)}
                                    {getStatusBadge(med.status)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAdminister(med.medicationId)}
                                    disabled={med.status !== "pending"}
                                >
                                    Administer
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
} 