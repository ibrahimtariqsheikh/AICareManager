"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { RateSheetManager } from "./components/rate-sheet-manager"
import { UserCircle, Users, Building2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setActiveRateSheetStaffType } from "@/state/slices/agencySlice"
import { RateSheetType } from "@/types/agencyTypes"


export default function RateSheetsPage() {
    const dispatch = useAppDispatch()
    const activeRateSheetStaffType = useAppSelector((state) => state.agency.activeRateSheetStaffType)

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Rate Sheet Management</h1>
                    <p className="text-sm text-neutral-600">
                        Manage your rate sheets efficiently. Add, edit, or delete rate sheets.
                    </p>
                </div>


            </div>

            <Card>
                <CardContent className="pt-6">
                    <Tabs value={activeRateSheetStaffType} onValueChange={(value) => dispatch(setActiveRateSheetStaffType(value as RateSheetType))} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-8">
                            <TabsTrigger value="CLIENT" className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4" />
                                <span>Clients</span>
                            </TabsTrigger>
                            <TabsTrigger value="CARE_WORKER" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Care Workers</span>
                            </TabsTrigger>
                            <TabsTrigger value="OFFICE_STAFF" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>Office Staff</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="CLIENT">
                            <RateSheetManager staffType="CLIENT" />
                        </TabsContent>

                        <TabsContent value="CARE_WORKER">
                            <RateSheetManager staffType="CARE_WORKER" />
                        </TabsContent>

                        <TabsContent value="OFFICE_STAFF">
                            <RateSheetManager staffType="OFFICE_STAFF" />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
