"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Clock, Edit, CheckCircle } from 'lucide-react'
import { setSelectedMedication, setMedicationDialogOpen, setAdministrationDialogOpen, Medication } from "@/state/slices/medicationSlice"
import { useAppDispatch } from "@/state/redux"


interface MedicationCardProps {
    medication: Medication;
    onEdit?: () => void;
    onAdminister?: () => void;
}

export function MedicationCard({ medication, onEdit, onAdminister }: MedicationCardProps) {
    const dispatch = useAppDispatch()

    const handleEdit = () => {
        if (onEdit) {
            onEdit()
        } else {
            dispatch(setSelectedMedication(medication))
            dispatch(setMedicationDialogOpen(true))
        }
    }

    const handleAdminister = () => {
        if (onAdminister) {
            onAdminister()
        } else {
            dispatch(setSelectedMedication(medication))
            dispatch(setAdministrationDialogOpen(true))
        }
    }

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-slate-600" />
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                    </div>
                    <Badge>{medication.dosage}</Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm font-medium">Instructions</div>
                        <div className="text-sm text-muted-foreground">{medication.instructions}</div>
                    </div>

                    <div>
                        <div className="text-sm font-medium">Reason</div>
                        <div className="text-sm text-muted-foreground">{medication.reason}</div>
                    </div>

                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{medication.schedule}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4 bg-gray-50">
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button size="sm" className="bg-slate-600 hover:bg-slate-700" onClick={handleAdminister}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Administer
                </Button>
            </CardFooter>
        </Card>
    )
} 