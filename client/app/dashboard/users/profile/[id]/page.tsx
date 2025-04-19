"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Mail, Phone } from "lucide-react"
import { useGetUserAllDetailsQuery } from "@/state/api"


export default function UserProfilePage() {
    const router = useRouter()
    const { id } = useParams()
    const userId = Array.isArray(id) ? id[0] : id

    // Queries
    const { data: userAllDetails, isLoading } = useGetUserAllDetailsQuery(userId || "")

    // Format subrole for display
    const formatSubrole = (subrole?: string) => {
        if (!subrole) return null
        return subrole.replace(/_/g, " ")
    }

    // Get role badge color
    const getRoleBadgeColor = (role?: string) => {
        if (!role) return ""

        switch (role) {
            case "CLIENT":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "CARE_WORKER":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "OFFICE_STAFF":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    if (isLoading) {
        return (
            <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-24 w-24 bg-muted rounded-full animate-pulse" />
                                <div className="space-y-2 text-center">
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                                </div>
                            </div>

                            <div className="h-[1px] bg-muted my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="h-4 w-4 bg-muted rounded animate-pulse mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                                        <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                                        <div className="h-3 w-36 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-[1px] bg-muted my-6" />

                            <div className="space-y-2">
                                <div className="h-9 w-full bg-muted rounded animate-pulse" />
                                <div className="h-9 w-full bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="bg-card rounded-lg shadow-sm">
                            <div className="p-6">
                                {/* Tabs Skeleton */}
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                                    ))}
                                </div>

                                {/* Content Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information Card */}
                                    <div className="bg-card rounded-lg shadow-sm p-4">
                                        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex justify-between">
                                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Contact Information Card */}
                                    <div className="bg-card rounded-lg shadow-sm p-4">
                                        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex justify-between">
                                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Key Contacts Skeleton */}
                                <div className="mt-6">
                                    <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <div className="space-y-2">
                                                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                                </div>
                                                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userAllDetails?.data) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Not Found</CardTitle>
                        <CardDescription>The user you are looking for does not exist.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push("/users")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    const userData = userAllDetails.data



    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 justify-start">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">User Profile</h1>
                </div>
                <Button onClick={() => router.push(`/dashboard/users/edit/${userId}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src=""
                                        alt={`${userData.firstName} ${userData.lastName}`}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {userData.firstName?.[0]}
                                        {userData.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="font-medium">
                                        {userData.firstName} {userData.lastName}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <Badge className={getRoleBadgeColor(userData.role)}>{userData.role}</Badge>
                                    {userData.subRole && <Badge variant="outline">{formatSubrole(userData.subRole)}</Badge>}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                {userData.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{userData.phoneNumber}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{userData.email}</span>
                                </div>
                                {userData.addressLine1 && (
                                    <div className="flex items-start gap-2">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg
                                                className="h-4 w-4 text-muted-foreground"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className="text-sm">
                                            <p>{userData.addressLine1}</p>
                                            {userData.addressLine2 && <p>{userData.addressLine2}</p>}
                                            {userData.townOrCity && userData.county && (
                                                <p>
                                                    {userData.townOrCity}, {userData.county} {userData.postalCode}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Schedule
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Message
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="medical">Medical</TabsTrigger>
                                    <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                                </TabsList>
                                <TabsContent value="profile" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Basic Information</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <dl className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Client ID</dt>
                                                        <dd className="text-sm">{userData.id.substring(0, 8)}...</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Preferred Name</dt>
                                                        <dd className="text-sm">{userData.preferredName || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">NHS Number</dt>
                                                        <dd className="text-sm">{userData.nhsNumber || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">DNRA Order</dt>
                                                        <dd className="text-sm">{userData.dnraOrder ? "Yes" : "No"}</dd>
                                                    </div>
                                                </dl>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Contact Information</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <dl className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                                                        <dd className="text-sm">{userData.addressLine1 || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                                                        <dd className="text-sm">{userData.phoneNumber || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Languages</dt>
                                                        <dd className="text-sm">{userData.languages || "Not provided"}</dd>
                                                    </div>
                                                </dl>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Key Contacts</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {userData.keyContacts?.map((contact, index) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{contact.name}</p>
                                                            <p className="text-sm text-muted-foreground">{contact.relation}</p>
                                                        </div>
                                                        <p className="text-sm">{contact.phone}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="personal" className="space-y-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Personal Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-2">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Language</dt>
                                                    <dd className="text-sm">{userData.languages || "English"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Allergies</dt>
                                                    <dd className="text-sm">{userData.allergies || "None"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Interests</dt>
                                                    <dd className="text-sm">{userData.interests || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Likes & Dislikes</dt>
                                                    <dd className="text-sm">{userData.likesDislikes || "Not provided"}</dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Mobility and Preferences</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-2">
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Mobility Level</dt>
                                                    <dd className="text-sm">{userData.mobility || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Property Access</dt>
                                                    <dd className="text-sm">{userData.propertyAccess || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Charge Rate</dt>
                                                    <dd className="text-sm">£{userData.chargeRate || "Not provided"}</dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="medical" className="space-y-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Medications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {userData.medicationRecords?.map((med, index) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{med.medication?.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {med.medication?.isSpecialist ? "Specialist" : "Regular"}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm">{med.dosage}</p>
                                                            <p className="text-sm text-muted-foreground">{med.frequency}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Medical History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-muted-foreground">
                                                {userData.history || "No medical history recorded"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="risk" className="space-y-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">Risk Assessments</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {userData.riskAssessments?.map((risk, index) => (
                                                    <div key={index} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-medium">General</h4>
                                                                <p className="text-sm text-muted-foreground">{risk.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm">Risk Score: {risk.riskScore}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Likelihood: {risk.likelihood} | Severity: {risk.severity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium">Affected Parties:</p>
                                                            <p className="text-sm text-muted-foreground">{risk.affectedParties}</p>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium">Management Plan:</p>
                                                            <p className="text-sm text-muted-foreground">{risk.mitigationStrategy}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}

