"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export function MedicationTable() {
    const [currentDate] = useState(new Date())

    // Mock data for scheduled medications
    const scheduledMedications = [
        {
            id: "1",
            name: "Hydrocortisone",
            dosage: "5mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(8, 0, 0)),
            status: "pending",
        },
        {
            id: "2",
            name: "Lisinopril",
            dosage: "10mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(8, 0, 0)),
            status: "pending",
        },
        {
            id: "3",
            name: "Metformin",
            dosage: "500mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(8, 0, 0)),
            status: "pending",
        },
        {
            id: "4",
            name: "Aspirin",
            dosage: "81mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(8, 0, 0)),
            status: "pending",
        },
        {
            id: "5",
            name: "Hydrocortisone",
            dosage: "5mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(13, 0, 0)),
            status: "pending",
        },
        {
            id: "6",
            name: "Metformin",
            dosage: "500mg",
            instructions: "Take 1 Tab by Mouth",
            scheduledTime: new Date(currentDate.setHours(19, 0, 0)),
            status: "pending",
        },
    ]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "given":
                return <Badge className="bg-green-100 text-green-800">Given</Badge>
            case "not_given":
                return <Badge className="bg-red-100 text-red-800">Not Given</Badge>
            case "refused":
                return <Badge className="bg-amber-100 text-amber-800">Refused</Badge>
            case "pending":
                return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Today's Schedule</h3>
                    <Badge variant="outline">{format(currentDate, "MMMM d, yyyy")}</Badge>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    PRN Medications
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Medication</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Instructions</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduledMedications.map((med) => (
                            <TableRow key={med.id}>
                                <TableCell className="font-medium">{format(med.scheduledTime, "h:mm a")}</TableCell>
                                <TableCell>{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.instructions}</TableCell>
                                <TableCell>{getStatusBadge(med.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Administer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

