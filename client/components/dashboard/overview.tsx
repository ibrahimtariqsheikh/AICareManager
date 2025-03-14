"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        clients: 12,
        careWorkers: 8,
    },
    {
        name: "Feb",
        clients: 14,
        careWorkers: 8,
    },
    {
        name: "Mar",
        clients: 16,
        careWorkers: 9,
    },
    {
        name: "Apr",
        clients: 18,
        careWorkers: 10,
    },
    {
        name: "May",
        clients: 20,
        careWorkers: 11,
    },
    {
        name: "Jun",
        clients: 22,
        careWorkers: 12,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar
                    dataKey="clients"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
                <Bar
                    dataKey="careWorkers"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary/70"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
