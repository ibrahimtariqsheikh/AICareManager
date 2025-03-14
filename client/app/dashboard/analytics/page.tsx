import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"

export default function AnalyticsPage() {
    return (
        <div className="flex-1 space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Client Metrics</CardTitle>
                        <CardDescription>Overview of client-related metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Client analytics content will appear here</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Care Worker Metrics</CardTitle>
                        <CardDescription>Overview of care worker performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Care worker analytics content will appear here</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Office Staff Metrics</CardTitle>
                        <CardDescription>Overview of office staff performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Office staff analytics content will appear here</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

