"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RateSheetManager } from "./components/rate-sheet-manager"
import { UserCircle, Users, Building2, FileSpreadsheet } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setActiveRateSheetStaffType } from "@/state/slices/agencySlice"
import { RateSheetType } from "@/types/agencyTypes"

export default function RateSheetsPage() {
    const dispatch = useAppDispatch()
    const activeRateSheetStaffType = useAppSelector((state) => state.agency.activeRateSheetStaffType)

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Rate Sheets</h1>
                <p className="text-muted-foreground">Manage hourly rates for clients, care workers, and office staff</p>
            </div>

            <Card>
                <CardHeader className="bg-muted/40">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-primary" />
                        <CardTitle>Rate Sheet Management</CardTitle>
                    </div>
                    <CardDescription>Create and manage rate sheets for different staff types</CardDescription>
                </CardHeader>
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
