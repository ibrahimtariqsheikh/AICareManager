"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRange } from "react-day-picker"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
    { name: "Jan", revenue: 4000, expenses: 2400 },
    { name: "Feb", revenue: 3000, expenses: 1398 },
    { name: "Mar", revenue: 2000, expenses: 9800 },
    { name: "Apr", revenue: 2780, expenses: 3908 },
    { name: "May", revenue: 1890, expenses: 4800 },
    { name: "Jun", revenue: 2390, expenses: 3800 },
]

interface BillingReportsProps {
    dateRange: DateRange | undefined
}

export function BillingReports({ dateRange }: BillingReportsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>
                        Revenue and expenses analysis for the selected period
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#8884d8" />
                                <Bar dataKey="expenses" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Clients</CardTitle>
                        <CardDescription>Revenue by client</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Client A", amount: "$12,000" },
                                { name: "Client B", amount: "$8,500" },
                                { name: "Client C", amount: "$6,200" },
                            ].map((client) => (
                                <div key={client.name} className="flex items-center justify-between">
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-muted-foreground">{client.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Distribution of payment methods</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { method: "Credit Card", percentage: "45%" },
                                { method: "Bank Transfer", percentage: "30%" },
                                { method: "Cash", percentage: "15%" },
                                { method: "Other", percentage: "10%" },
                            ].map((item) => (
                                <div key={item.method} className="flex items-center justify-between">
                                    <div className="font-medium">{item.method}</div>
                                    <div className="text-muted-foreground">{item.percentage}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 