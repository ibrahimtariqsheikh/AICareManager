"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Clock, Edit, CheckCircle } from "lucide-react"

interface MedicationCardProps {
    name: string
    dosage: string
    instructions: string
    reason: string
    schedule: string
    onEdit: () => void
    onAdminister: () => void
}

export function MedicationCard({
    name,
    dosage,
    instructions,
    reason,
    schedule,
    onEdit,
    onAdminister,
}: MedicationCardProps) {
    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-emerald-600" />
                        <CardTitle className="text-lg">{name}</CardTitle>
                    </div>
                    <Badge>{dosage}</Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="space-y-3">
                    <div>
                        <div className="text-sm font-medium">Instructions</div>
                        <div className="text-sm text-muted-foreground">{instructions}</div>
                    </div>

                    <div>
                        <div className="text-sm font-medium">Reason</div>
                        <div className="text-sm text-muted-foreground">{reason}</div>
                    </div>

                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{schedule}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4 bg-gray-50">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={onAdminister}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Administer
                </Button>
            </CardFooter>
        </Card>
    )
}

