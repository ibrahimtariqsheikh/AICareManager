"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Mail, Phone } from "lucide-react"
import { useGetUserByIdQuery } from "@/state/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmergencyContact, Medication, RiskAssessment } from "@/types/profileTypes"

export default function UserProfilePage() {
    const router = useRouter()
    const { id } = useParams()
    const userId = Array.isArray(id) ? id[0] : id

    // Queries
    const { data: userData, isLoading } = useGetUserByIdQuery(userId || "")

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
        return <LoadingSpinner />
    }

    if (!userData) {
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

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 justify-start">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">User Profile</h1>
                </div>
                <Button onClick={() => router.push(`/users/edit/${userId}`)}>
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
                                        src={userData.data.profile?.avatarUrl || ""}
                                        alt={`${userData.data.firstName} ${userData.data.lastName}`}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {userData.data.firstName?.[0]}
                                        {userData.data.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="font-medium">
                                        {userData.data.firstName} {userData.data.lastName}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">{userData.data.email}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <Badge className={getRoleBadgeColor(userData.data.role)}>{userData.data.role}</Badge>
                                    {userData.data.subRole && <Badge variant="outline">{formatSubrole(userData.data.subRole)}</Badge>}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                {userData.data.profile?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{userData.data.profile.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{userData.data.email}</span>
                                </div>
                                {userData.data.profile?.address && (
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
                                            <p>{userData.data.profile.address}</p>
                                            {userData.data.profile.city && userData.data.profile.state && (
                                                <p>
                                                    {userData.data.profile.city}, {userData.data.profile.state} {userData.data.profile.zipCode}
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
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="medical">Medical</TabsTrigger>
                                    <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base">Basic Information</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <dl className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Client ID</dt>
                                                        <dd className="text-sm">{userData.data.id.substring(0, 8)}...</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Preferred Name</dt>
                                                        <dd className="text-sm">{userData.data.profile?.preferredName || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                                                        <dd className="text-sm">{userData.data.profile?.dateOfBirth || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Communication Preference</dt>
                                                        <dd className="text-sm">{userData.data.profile?.communicationPreference || "Not provided"}</dd>
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
                                                        <dd className="text-sm">{userData.data.profile?.address || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                                                        <dd className="text-sm">{userData.data.profile?.phone || "Not provided"}</dd>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <dt className="text-sm font-medium text-muted-foreground">Alternate Phone</dt>
                                                        <dd className="text-sm">{userData.data.profile?.alternatePhone || "Not provided"}</dd>
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
                                                {userData.data.profile?.emergencyContacts?.map((contact: EmergencyContact, index: number) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{contact.name}</p>
                                                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
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
                                                    <dd className="text-sm">{userData.data.profile?.language || "English"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Allergies</dt>
                                                    <dd className="text-sm">{userData.data.profile?.allergies || "None"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Interests</dt>
                                                    <dd className="text-sm">{userData.data.profile?.interests || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Hobbies</dt>
                                                    <dd className="text-sm">{userData.data.profile?.hobbies || "Not provided"}</dd>
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
                                                    <dd className="text-sm">{userData.data.profile?.mobility || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Likes</dt>
                                                    <dd className="text-sm">{userData.data.profile?.likes || "Not provided"}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-sm font-medium text-muted-foreground">Dislikes</dt>
                                                    <dd className="text-sm">{userData.data.profile?.dislikes || "Not provided"}</dd>
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
                                                {userData.data.profile?.medications?.map((med: Medication, index: number) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium">{med.name}</p>
                                                            <p className="text-sm text-muted-foreground">{med.type}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm">{med.dosage}mg</p>
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
                                                {userData.data.profile?.medicalHistory || "No medical history recorded"}
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
                                                {userData.data.profile?.riskAssessments?.map((risk: RiskAssessment, index: number) => (
                                                    <div key={index} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-medium">{risk.category}</h4>
                                                                <p className="text-sm text-muted-foreground">{risk.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm">Risk Score: {risk.score}</p>
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
                                                            <p className="text-sm text-muted-foreground">{risk.managementPlan}</p>
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

