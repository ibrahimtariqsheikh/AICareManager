"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchMedications } from "@/state/slices/medicationSlice"
import { useAppDispatch } from "@/state/redux"
import { User } from "@/types/prismaTypes"
import { StatusLegend } from "./status-legend"
import { MedicationLog } from "./medication-log"
import { AddMedicationModal } from "@/components/add-medication-modal"
import { CheckInModal } from "@/components/check-in-modal"

interface EMARProps {
    user: User
}

export const EMAR = ({ user }: EMARProps) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchMedications(user.id))
    }, [dispatch, user.id])

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <StatusLegend />
            </div>

            <Card>
                <CardContent className="p-6">
                    <MedicationLog userId={user.id} />
                </CardContent>
            </Card>

            <AddMedicationModal userId={user.id} />
            <CheckInModal />
        </div>
    )
}
