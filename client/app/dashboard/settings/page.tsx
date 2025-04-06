"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
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

export default function SettingsPage() {
    // Agency settings state
    const [allowCareWorkersEditCheckIn, setAllowCareWorkersEditCheckIn] = useState(false)
    const [allowFamilyReviews, setAllowFamilyReviews] = useState(false)
    const [enableFamilySchedule, setEnableFamilySchedule] = useState(false)
    const [enableWeek1And2Scheduling, setEnableWeek1And2Scheduling] = useState(false)
    const [lateVisitThreshold, setLateVisitThreshold] = useState("15")
    const [enableDistanceAlerts, setEnableDistanceAlerts] = useState(true)
    const [distanceThreshold, setDistanceThreshold] = useState("10")

    // Notification settings state
    const [lateVisitAlerts, setLateVisitAlerts] = useState(true)
    const [clientBirthdayReminders, setClientBirthdayReminders] = useState(true)
    const [careWorkerVisitAlerts, setCareWorkerVisitAlerts] = useState(true)
    const [missedMedicationAlerts, setMissedMedicationAlerts] = useState(true)
    const [clientAndCareWorkerReminders, setClientAndCareWorkerReminders] = useState(true)
    const [distanceAlerts, setDistanceAlerts] = useState(true)
    const [reviewNotifications, setReviewNotifications] = useState(true)

    // Handle save settings
    const handleSaveSettings = () => {
        toast.success("Settings saved successfully")
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <Button onClick={handleSaveSettings}>
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
                                        checked={allowCareWorkersEditCheckIn}
                                        onCheckedChange={setAllowCareWorkersEditCheckIn}
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
                                        checked={allowFamilyReviews}
                                        onCheckedChange={setAllowFamilyReviews}
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
                                            checked={enableFamilySchedule}
                                            onCheckedChange={setEnableFamilySchedule}
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
                                        checked={enableWeek1And2Scheduling}
                                        onCheckedChange={setEnableWeek1And2Scheduling}
                                    />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="late-visit-threshold" className="font-medium">
                                            When is a visit considered late?
                                        </Label>
                                        <div className="flex items-center">
                                            <Input
                                                id="late-visit-threshold"
                                                type="number"
                                                value={lateVisitThreshold}
                                                onChange={(e) => setLateVisitThreshold(e.target.value)}
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
                                                checked={enableDistanceAlerts}
                                                onCheckedChange={setEnableDistanceAlerts}
                                            />
                                        </div>
                                        {enableDistanceAlerts && (
                                            <div className="flex items-center mt-2">
                                                <Input
                                                    id="distance-threshold"
                                                    type="number"
                                                    value={distanceThreshold}
                                                    onChange={(e) => setDistanceThreshold(e.target.value)}
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
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <Users className="mr-2 h-4 w-4" />
                                    Groups
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Rate Sheets
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <Building className="mr-2 h-4 w-4" />
                                    Agency Details & Documents
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Custom Tasks
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Care Plan Custom Fields
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Policies and Procedures
                                </Button>
                                <Button variant="outline" className="justify-start p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documents
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
                                <Switch id="late-visit-alerts" checked={lateVisitAlerts} onCheckedChange={setLateVisitAlerts} />
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
                                    checked={clientBirthdayReminders}
                                    onCheckedChange={setClientBirthdayReminders}
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
                                    checked={careWorkerVisitAlerts}
                                    onCheckedChange={setCareWorkerVisitAlerts}
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
                                    checked={missedMedicationAlerts}
                                    onCheckedChange={setMissedMedicationAlerts}
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
                                    checked={clientAndCareWorkerReminders}
                                    onCheckedChange={setClientAndCareWorkerReminders}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-border transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="distance-alerts" className="font-medium">
                                        Distance alerts
                                    </Label>
                                </div>
                                <Switch id="distance-alerts" checked={distanceAlerts} onCheckedChange={setDistanceAlerts} />
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
                                    checked={reviewNotifications}
                                    onCheckedChange={setReviewNotifications}
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
                                <Select defaultValue="email">
                                    <SelectTrigger id="notification-method">
                                        <SelectValue placeholder="Select notification method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="sms">SMS</SelectItem>
                                        <SelectItem value="push">Push Notifications</SelectItem>
                                        <SelectItem value="all">All Methods</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notification-frequency">Notification frequency</Label>
                                <Select defaultValue="immediate">
                                    <SelectTrigger id="notification-frequency">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="immediate">Immediate</SelectItem>
                                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                                        <SelectItem value="daily">Daily Digest</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
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
                            <Button variant="destructive" className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Out
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
