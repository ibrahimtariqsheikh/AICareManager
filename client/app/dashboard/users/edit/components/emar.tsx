"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/state/redux"
import { Medication, User } from "@/types/prismaTypes"

import { MedicationLog } from "./medication-log"
import { AddMedicationModal } from "@/components/add-medication-modal"
import { CheckInModal } from "@/components/check-in-modal"
import { setMedications, setMedicationLogs } from "@/state/slices/medicationSlice"

interface EMARProps {
    user: User
}

export const EMAR = ({ user }: EMARProps) => {
    const dispatch = useAppDispatch()


    const medicationsFromUser = user?.medications || []
    const logsFromUser = medicationsFromUser.map((medication: Medication) => medication.logs || [])

    useEffect(() => {
        if (user && user.id) {
            dispatch(setMedications(medicationsFromUser))
            dispatch(setMedicationLogs(logsFromUser))
        }
    }, [dispatch, user?.id, medicationsFromUser, logsFromUser])

    return (
        <div className="space-y-3">
            <Card>
                <CardContent className="p-2">
                    <MedicationLog />
                </CardContent>
            </Card>
            <AddMedicationModal user={user} />
            <CheckInModal user={user} />
        </div>
    )
}
