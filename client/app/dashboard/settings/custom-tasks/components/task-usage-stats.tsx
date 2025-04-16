"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import type { CustomTask } from "../types"

interface TaskUsageStatsProps {
  tasks: CustomTask[]
}

export function TaskUsageStats({ tasks }: TaskUsageStatsProps) {
  // Calculate task usage by priority
  const tasksByPriority = [
    { name: "High", value: tasks.filter((task) => task.priority === "high").length },
    { name: "Medium", value: tasks.filter((task) => task.priority === "medium").length },
    { name: "Low", value: tasks.filter((task) => task.priority === "low").length },
  ]

  // Calculate task usage by frequency
  const tasksByFrequency = [
    { name: "Daily", value: tasks.filter((task) => task.frequency === "daily").length },
    { name: "Weekly", value: tasks.filter((task) => task.frequency === "weekly").length },
    { name: "As Needed", value: tasks.filter((task) => task.frequency === "as-needed").length },
  ]

  // Calculate most used tasks
  const taskUsage = tasks
    .map((task) => ({
      name: task.name,
      clients: task.clients?.length || 0,
    }))
    .sort((a, b) => b.clients - a.clients)
    .slice(0, 10)

  // Colors for the pie chart
  const PRIORITY_COLORS = ["#ef4444", "#f59e0b", "#10b981"]
  const FREQUENCY_COLORS = ["#3b82f6", "#8b5cf6", "#6b7280"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Frequency</CardTitle>
            <CardDescription>Distribution of tasks by frequency</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByFrequency}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tasksByFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FREQUENCY_COLORS[index % FREQUENCY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Used Tasks</CardTitle>
          <CardDescription>Tasks assigned to the most clients</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskUsage}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" name="Number of Clients" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
