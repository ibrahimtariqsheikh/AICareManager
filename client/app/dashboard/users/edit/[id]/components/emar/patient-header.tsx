"use client"

import { useAppSelector, useAppDispatch } from "@/state/redux"
import { Phone, Mail, FileText, Edit, Share, Printer, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { User as UserType } from "@/types/prismaTypes"

interface PatientHeaderProps {
    user: UserType
}

export function PatientHeader({ user }: PatientHeaderProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Low":
                return "bg-slate-100 text-slate-800 hover:bg-slate-200"
            case "Medium":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            case "High":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            default:
                return "bg-slate-100 text-slate-800 hover:bg-slate-200"
        }
    }

    if (!user) {
        return (
            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <p className="text-muted-foreground">Loading patient information...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`
    const initials = `${user.profile?.firstName?.[0] || ''}${user.profile?.lastName?.[0] || ''}`
    const careLevel = user.profile?.careLevel || "Low"
    const age = user.profile?.age || "Not specified"
    const room = user.profile?.room || "Not assigned"
    const admissionDate = user.profile?.admissionDate || "Not specified"
    const phone = user.profile?.phoneNumber || "No phone"
    const email = user.profile?.email || "No email"
    const primaryPhysician = user.profile?.medicalInfo?.primaryPhysician || "Not specified"
    const primaryDiagnosis = user.profile?.medicalInfo?.primaryDiagnosis || "Not specified"
    const allergies = user.profile?.medicalInfo?.allergies || "None reported"

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                            <AvatarImage src={user.profile?.avatarUrl || "/placeholder.svg?height=80&width=80"} alt={fullName} />
                            <AvatarFallback className="text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">{fullName}</h2>
                                <Badge className={getStatusColor(careLevel)}>{careLevel} Care Level</Badge>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>Age {age}</span>
                                </div>
                                <div className="flex items-center">
                                    <span>Room {room}</span>
                                </div>
                                <div className="flex items-center">
                                    <span>Arrived {admissionDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Phone className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">{phone}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Phone Number</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Mail className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">{email}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Email Address</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button className="bg-slate-600 hover:bg-slate-700" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Record Vital
                        </Button>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Primary Care Provider</p>
                        <p className="text-sm">{primaryPhysician}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Primary Diagnosis</p>
                        <p className="text-sm">{primaryDiagnosis}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                        <p className="text-sm">{allergies}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 