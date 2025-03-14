import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Account settings content will appear here</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Organization Settings</CardTitle>
                        <CardDescription>Manage organization-wide settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Organization settings content will appear here</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

