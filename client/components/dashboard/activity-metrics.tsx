"use client"

import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts"

const visitData = [
    { name: "Mon", visits: 12 },
    { name: "Tue", visits: 18 },
    { name: "Wed", visits: 15 },
    { name: "Thu", visits: 20 },
    { name: "Fri", visits: 25 },
    { name: "Sat", visits: 10 },
    { name: "Sun", visits: 5 },
]

const clientTypeData = [
    { name: "Regular Care", value: 65 },
    { name: "Intensive Care", value: 25 },
    { name: "Occasional Care", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const performanceData = [
    {
        name: "Week 1",
        "On Time": 90,
        "Completed Tasks": 85,
        "Client Satisfaction": 92,
    },
    {
        name: "Week 2",
        "On Time": 85,
        "Completed Tasks": 88,
        "Client Satisfaction": 90,
    },
    {
        name: "Week 3",
        "On Time": 92,
        "Completed Tasks": 90,
        "Client Satisfaction": 94,
    },
    {
        name: "Week 4",
        "On Time": 88,
        "Completed Tasks": 92,
        "Client Satisfaction": 93,
    },
]

export function ActivityMetrics() {
    return (
        <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="visits">Visit Trends</TabsTrigger>
                <TabsTrigger value="clients">Client Types</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="mt-4">
                <Card>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="On Time" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Completed Tasks" stroke="#06b6d4" strokeWidth={2} />
                                <Line type="monotone" dataKey="Client Satisfaction" stroke="#f97316" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="visits" className="mt-4">
                <Card>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={visitData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="visits" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="clients" className="mt-4">
                <Card>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={clientTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {clientTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

