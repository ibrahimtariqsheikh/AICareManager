"use client"

import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle2, User, Mail, Calendar, Briefcase, Shield } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { ToolInvocation } from "ai"
import { useCreateUserMutation, useGetAgencyUsersQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"
import { useState, useRef, useEffect } from "react"

interface CareWorkerToolResult {
    fullName: string
    email: string
    dateOfBirth: string
    subRole: string
}

type ExtendedToolInvocation = ToolInvocation & {
    result?: CareWorkerToolResult
}

export default function CreateCareWorkerTool(toolInvocation: ExtendedToolInvocation) {
    console.log("toolInvocation", toolInvocation)
    const [error, setError] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [hasCreated, setHasCreated] = useState(false)
    const [createUser] = useCreateUserMutation()
    const { user } = useAppSelector((state) => state.user)
    const { refetch: refetchUsers } = useGetAgencyUsersQuery(user?.userInfo?.agencyId || "")
    const { toast } = useToast()


    const createClientProfile = async (data: {
        fullName: string
        email: string
        dateOfBirth: string
        subRole: string
    }) => {
        try {
            const result = await createUser({
                email: data.email,
                fullName: data.fullName,
                role: "CARE_WORKER",
                subRole: data.subRole,
                cognitoId: uuidv4(),
                inviterId: user?.userInfo?.id || "",
                agencyId: user?.userInfo?.agencyId || "",
            }).unwrap()

            await refetchUsers()

            toast({
                title: "Success",
                description: "Care worker profile created successfully",
                variant: "default",
            })

            return result
        } catch (error: any) {
            console.error("Error creating care worker profile:", error)
            const errorMessage = error?.data?.message || "Failed to create care worker profile. Please try again."
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw new Error(errorMessage)
        }
    }

    useEffect(() => {
        let isMounted = true;

        if (toolInvocation.state === "result" && !isCreating && !hasCreated && toolInvocation.result) {
            const { fullName, email, dateOfBirth, subRole } = toolInvocation.result;

            setIsCreating(true);

            createClientProfile({
                fullName,
                email,
                dateOfBirth,
                subRole,
            }).then(() => {
                if (isMounted) {
                    setIsCreating(false);
                    setHasCreated(true);
                }
            }).catch((err) => {
                if (isMounted) {
                    setError(err.message || "Failed to create care worker profile");
                    setIsCreating(false);
                    setHasCreated(false);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [toolInvocation.state, toolInvocation.result, isCreating, hasCreated, createClientProfile]);


    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <div className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                {isCreating ? <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-neutral-500" />}
                            </div>
                        </div>
                        <div>
                            <div className="font-medium">Creating care worker profile</div>
                            <div className="text-sm text-neutral-500">Processing information...</div>
                        </div>
                    </div>

                    {/* Loading skeleton */}
                    <div className="mt-3 space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center"
                            >
                                <div className="h-2 bg-muted rounded w-16"></div>
                                <div className="h-2 bg-muted rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-medium">Error</div>
                            <div className="text-sm text-red-500">{error}</div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    if (toolInvocation.state === "result" && toolInvocation.result) {
        const { fullName, email, dateOfBirth, role, subRole, status } = toolInvocation.result

        const getStatusColor = (status: string) => {
            switch (status?.toLowerCase()) {
                case "active":
                    return "bg-green-100 text-green-700"
                case "pending":
                    return "bg-yellow-100 text-yellow-700"
                case "inactive":
                    return "bg-gray-100 text-gray-700"
                default:
                    return "bg-muted text-neutral-500"
            }
        }

        return (
            <div className="w-[320px]">
                <Card className="bg-background rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-muted p-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-black" />
                            </div>
                            <div>
                                <div className="font-medium text-black text-sm">
                                    Care Worker Profile Created
                                </div>
                                <div className="text-xs text-neutral-500">
                                    Successfully added to system
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-neutral-500" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">{fullName}</div>
                                <div className="text-[10px] text-neutral-700">Care Worker Profile</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                                <div className="flex-1">
                                    <Label className="text-xs text-neutral-500 shadow-none">Email</Label>
                                    <div className="text-xs font-medium">{email}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                                <div className="flex-1">
                                    <Label className="text-xs text-neutral-500 shadow-none">Date of Birth</Label>
                                    <div className="text-xs font-medium">
                                        {new Date(dateOfBirth).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-neutral-500" />
                                <div className="flex-1">
                                    <Label className="text-xs text-neutral-500">Sub-Role</Label>
                                    <div className="text-xs font-medium">{subRole}</div>
                                </div>
                            </div>


                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return null
}