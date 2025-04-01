"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        "Home Visits": 65,
        Appointments: 42,
        "Weekly Checkups": 28,
    },
    {
        name: "Feb",
        "Home Visits": 59,
        Appointments: 38,
        "Weekly Checkups": 24,
    },
    {
        name: "Mar",
        "Home Visits": 80,
        Appointments: 56,
        "Weekly Checkups": 32,
    },
    {
        name: "Apr",
        "Home Visits": 81,
        Appointments: 55,
        "Weekly Checkups": 34,
    },
    {
        name: "May",
        "Home Visits": 76,
        Appointments: 48,
        "Weekly Checkups": 30,
    },
    {
        name: "Jun",
        "Home Visits": 84,
        Appointments: 52,
        "Weekly Checkups": 36,
    },
    {
        name: "Jul",
        "Home Visits": 92,
        Appointments: 58,
        "Weekly Checkups": 40,
    },
    {
        name: "Aug",
        "Home Visits": 88,
        Appointments: 62,
        "Weekly Checkups": 42,
    },
    {
        name: "Sep",
        "Home Visits": 94,
        Appointments: 68,
        "Weekly Checkups": 46,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Home Visits" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Appointments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Weekly Checkups" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

