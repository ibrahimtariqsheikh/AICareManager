"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomSelect } from "@/components/ui/custom-select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
    Bell,
    Building,
    Calendar,

    Clock,
    FileText,
    Key,
    LifeBuoy,
    LogOut,
    MapPin,
    Save,
    SettingsIcon,
    Star,
    Users,
} from "lucide-react"
import { signOut } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/state/redux"
import { setDistanceThresholdRedux, setLateVisitThresholdRedux, setNotificationFrequencyRedux, setPreferredNotificationMethodRedux, toggleAllowCareWorkersEditCheckInRedux, toggleAllowFamilyReviewsRedux, toggleCareWorkerVisitAlertsRedux, toggleClientAndCareWorkerRemindersRedux, toggleClientBirthdayRemindersRedux, toggleDistanceAlertsRedux, toggleEnableFamilyScheduleRedux, toggleEnableWeek1And2SchedulingRedux, toggleLateVisitAlertsRedux, toggleMissedMedicationAlertsRedux, toggleReviewNotificationsRedux } from "@/state/slices/agencySlice"
import { useUpdateAgencyMutation } from "@/state/api"
import { toast } from "sonner"


type PreferredNotificationMethod = "EMAIL" | "SMS" | "PHONE"
type NotificationFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"


export default function SettingsPage() {




    const { agency } = useAppSelector((state: any) => state.agency)
    const dispatch = useAppDispatch()

    const router = useRouter()

    const [updateAgency] = useUpdateAgencyMutation()

    const handleLogout = () => {
        signOut()
        router.push("/")
    }

    const toggleAllowCareWorkersEditCheckIn = () => {
        dispatch(toggleAllowCareWorkersEditCheckInRedux(!agency?.allowCareWorkersEditCheckIn))
    }

    const toggleAllowFamilyReviews = () => {
        dispatch(toggleAllowFamilyReviewsRedux(!agency?.allowFamilyReviews))
    }

    const toggleEnableFamilySchedule = () => {
        dispatch(toggleEnableFamilyScheduleRedux(!agency?.enableFamilySchedule))
    }

    const toggleEnableWeek1And2Scheduling = () => {
        dispatch(toggleEnableWeek1And2SchedulingRedux(!agency?.enableWeek1And2Scheduling))
    }

    const toggleDistanceAlerts = () => {
        dispatch(toggleDistanceAlertsRedux(!agency?.enableDistanceAlerts))
    }

    const setLateVisitThreshold = (value: string) => {
        dispatch(setLateVisitThresholdRedux(value))
    }

    const setDistanceThreshold = (value: string) => {
        dispatch(setDistanceThresholdRedux(value))
    }

    const setNotificationFrequency = (value: NotificationFrequency) => {
        dispatch(setNotificationFrequencyRedux(value))
    }

    const setPreferredNotificationMethod = (value: PreferredNotificationMethod) => {
        dispatch(setPreferredNotificationMethodRedux(value))
    }

    const toggleLateVisitAlerts = () => {
        dispatch(toggleLateVisitAlertsRedux(!agency?.lateVisitAlerts))
    }

    const toggleClientBirthdayReminders = () => {
        dispatch(toggleClientBirthdayRemindersRedux(!agency?.clientBirthdayReminders))
    }

    const toggleCareWorkerVisitAlerts = () => {
        dispatch(toggleCareWorkerVisitAlertsRedux(!agency?.careWorkerVisitAlerts))
    }

    const toggleMissedMedicationAlerts = () => {
        dispatch(toggleMissedMedicationAlertsRedux(!agency?.missedMedicationAlerts))
    }

    const toggleClientAndCareWorkerReminders = () => {
        dispatch(toggleClientAndCareWorkerRemindersRedux(!agency?.clientAndCareWorkerReminders))
    }

    const toggleReviewNotifications = () => {
        dispatch(toggleReviewNotificationsRedux(!agency?.reviewNotifications))
    }

    const saveSettings = async () => {
        await updateAgency({
            agencyId: agency?.id,
            agency: {
                ...agency,
                updatedAt: new Date().toISOString()
            }
        })
        toast.success("Settings saved")
    }




    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Settings</h2>
                <Button onClick={() => {
                    saveSettings()
                }}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="agency" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="agency">
                        <Building className="mr-2 h-4 w-4" />
                        Agency Settings
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Account
                    </TabsTrigger>
                </TabsList>

                {/* Agency Settings Tab */}
                <TabsContent value="agency" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Agency Settings</CardTitle>
                            <CardDescription>Configure how your agency operates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <div>
                                        <Label htmlFor="allow-edit-checkin" className="font-medium">
                                            Allow care workers to edit check-in time?
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            When enabled, care workers can modify their check-in times after visits
                                        </p>
                                    </div>
                                    <Switch
                                        id="allow-edit-checkin"
                                        checked={agency?.allowCareWorkersEditCheckIn}
                                        onCheckedChange={
                                            () => {
                                                toggleAllowCareWorkersEditCheckIn()
                                            }
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <div>
                                        <Label htmlFor="allow-family-reviews" className="font-medium">
                                            Allow friends and family reviews?
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            When enabled, family members can leave reviews for care workers
                                        </p>
                                    </div>
                                    <Switch
                                        id="allow-family-reviews"
                                        checked={agency?.allowFamilyReviews}
                                        onCheckedChange={
                                            () => {
                                                toggleAllowFamilyReviews()
                                            }
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <div>
                                        <Label htmlFor="enable-family-schedule" className="font-medium">
                                            Enable friends and family schedule?
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            When enabled, family members can view care schedules
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full mr-2">New</span>
                                        <Switch
                                            id="enable-family-schedule"
                                            checked={agency?.enableFamilySchedule}
                                            onCheckedChange={
                                                () => {
                                                    toggleEnableFamilySchedule()
                                                }
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <div>
                                        <Label htmlFor="enable-week-scheduling" className="font-medium">
                                            Enable week 1 & 2 scheduling?
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            When enabled, scheduling can be done in week 1 & 2 format
                                        </p>
                                    </div>
                                    <Switch
                                        id="enable-week-scheduling"
                                        checked={agency?.enableWeek1And2Scheduling}
                                        onCheckedChange={
                                            () => {
                                                toggleEnableWeek1And2Scheduling()
                                            }
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="late-visit-threshold" className="font-medium">
                                            When is a visit considered late?
                                        </Label>
                                        <div className="flex items-center">
                                            <CustomInput
                                                id="late-visit-threshold"
                                                type="number"
                                                value={agency?.lateVisitThreshold}
                                                onChange={(value) => {
                                                    setLateVisitThreshold(value)
                                                }}
                                                className="w-20 mr-2"
                                            />
                                            <span>minutes</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="enable-distance-alerts" className="font-medium">
                                                Enable distance alerts?
                                            </Label>
                                            <Switch
                                                id="enable-distance-alerts"
                                                checked={agency?.enableDistanceAlerts}
                                                onCheckedChange={
                                                    () => {
                                                        toggleDistanceAlerts()
                                                    }
                                                }
                                            />
                                        </div>
                                        {agency?.enableDistanceAlerts && (
                                            <div className="flex items-center mt-2">
                                                <CustomInput
                                                    id="distance-threshold"
                                                    type="number"
                                                    value={agency?.distanceThreshold}
                                                    onChange={(value) => {
                                                        setDistanceThreshold(value)
                                                    }}
                                                    className="w-20 mr-2"
                                                />
                                                <span>meters</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Agency</CardTitle>
                            <CardDescription>Access additional agency management features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm"
                                    onClick={() => router.push("/dashboard/settings/groups")}
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Groups
                                    </div>
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm"
                                    onClick={() => router.push("/dashboard/settings/rate-sheets")}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Rate Sheets
                                    </div>
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm"
                                    onClick={() => router.push("/dashboard/settings/custom-tasks")}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Custom Tasks
                                    </div>
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm"
                                    onClick={() => router.push("/dashboard/settings/agency-details")}
                                >
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Agency Details & Documents
                                    </div>
                                </Button>

                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm" onClick={() => router.push("/dashboard/settings/documents")}>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Documents
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Notifications</CardTitle>
                            <CardDescription>Manage which notifications you receive</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="late-visit-alerts" className="font-medium">
                                        Late visit alerts
                                    </Label>
                                </div>
                                <Switch id="late-visit-alerts" checked={agency?.lateVisitAlerts} onCheckedChange={
                                    () => {
                                        toggleLateVisitAlerts()
                                    }
                                } />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="client-birthday-reminders" className="font-medium">
                                        Client birthday reminders
                                    </Label>
                                </div>
                                <Switch
                                    id="client-birthday-reminders"
                                    checked={agency?.clientBirthdayReminders}
                                    onCheckedChange={
                                        () => {
                                            toggleClientBirthdayReminders()
                                        }
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="care-worker-visit-alerts" className="font-medium">
                                        Care worker visit alerts
                                    </Label>
                                </div>
                                <Switch
                                    id="care-worker-visit-alerts"
                                    checked={agency?.careWorkerVisitAlerts}
                                    onCheckedChange={
                                        () => {
                                            toggleCareWorkerVisitAlerts()
                                        }
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="missed-medication-alerts" className="font-medium">
                                        Missed medication alerts
                                    </Label>
                                </div>
                                <Switch
                                    id="missed-medication-alerts"
                                    checked={agency?.missedMedicationAlerts}
                                    onCheckedChange={
                                        () => {
                                            toggleMissedMedicationAlerts()
                                        }
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="client-care-worker-reminders" className="font-medium">
                                        Client and care worker reminders
                                    </Label>
                                </div>
                                <Switch
                                    id="client-care-worker-reminders"
                                    checked={agency?.clientAndCareWorkerReminders}
                                    onCheckedChange={
                                        () => {
                                            toggleClientAndCareWorkerReminders()
                                        }
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="distance-alerts" className="font-medium">
                                        Distance alerts
                                    </Label>
                                </div>
                                <Switch id="distance-alerts" checked={agency?.distanceAlerts} onCheckedChange={
                                    () => {
                                        toggleDistanceAlerts()
                                    }
                                } />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="review-notifications" className="font-medium">
                                        Review notifications
                                    </Label>
                                </div>
                                <Switch
                                    id="review-notifications"
                                    checked={agency?.reviewNotifications}
                                    onCheckedChange={
                                        () => {
                                            toggleReviewNotifications()
                                        }
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notification-method">Preferred notification method</Label>
                                <CustomSelect
                                    id="notification-method"
                                    value={agency?.preferredNotificationMethod}
                                    onChange={(value) => {
                                        setPreferredNotificationMethod(value as PreferredNotificationMethod)
                                    }}
                                    options={[
                                        { value: "EMAIL", label: "Email" },
                                        { value: "SMS", label: "SMS" },
                                        { value: "PHONE", label: "Phone Call" }
                                    ]}
                                    placeholder="Select notification method"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notification-frequency">Notification frequency</Label>
                                <CustomSelect
                                    id="notification-frequency"
                                    value={agency?.notificationFrequency}
                                    onChange={(value) => {
                                        setNotificationFrequency(value as NotificationFrequency)
                                    }}
                                    options={[
                                        { value: "DAILY", label: "Daily" },
                                        { value: "WEEKLY", label: "Weekly" },
                                        { value: "MONTHLY", label: "Monthly" },
                                        { value: "YEARLY", label: "Yearly" }
                                    ]}
                                    placeholder="Select frequency"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <CustomInput id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <CustomInput id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <CustomInput id="confirm-password" type="password" />
                            </div>
                            <Button>
                                <Key className="mr-2 h-4 w-4" />
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support & Legal</CardTitle>
                            <CardDescription>Access support and legal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2"></div>
                            <Button variant="outline" className="w-full justify-start">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Contact OnCare Support
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Terms and Conditions
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Export Profile Data
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Privacy Policy
                            </Button>
                            <div className="flex justify-end">
                                <Button variant="destructive" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </TabsContent>
            </Tabs>

            {/* <div className="flex flex-col gap-2 ">
                <h2 className="text-2xl font-bold my-6">Agency Object</h2>
                <pre className="bg-gray-100 p-4 rounded-md">
                    {JSON.stringify(agency, null, 2)}
                </pre>
            </div> */}

        </div>
    )
}
