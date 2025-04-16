"use client"

import { useState, useEffect } from "react"
import type { CustomTask, TaskCategory } from "../types"

// This is a mock implementation. In a real app, you would connect to your API
export function useCustomTasks() {
  const [tasks, setTasks] = useState<CustomTask[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("customTasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    } else {
      // Add some sample tasks if none exist
      setTasks([
        {
          id: "1",
          name: "Blood Pressure",
          placeholder: "Provide blood pressure recording",
          icon: "activity",
          categoryId: "1",
          priority: "high",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          clients: [{ id: "1", name: "Andrew Brown" }],
        },
        {
          id: "2",
          name: "Fire Safety",
          placeholder: "Check the gas in the kitchen.",
          icon: "flame",
          categoryId: "2",
          priority: "medium",
          frequency: "weekly",
          createdAt: new Date().toISOString(),
          clients: [{ id: "1", name: "Andrew Brown" }],
        },
        {
          id: "3",
          name: "Glucose Monitoring",
          placeholder: "Record blood glucose level",
          icon: "droplet",
          categoryId: "1",
          priority: "high",
          frequency: "daily",
          createdAt: new Date().toISOString(),
          clients: [{ id: "1", name: "Andrew Brown" }],
        },
      ])
    }

    const storedCategories = localStorage.getItem("taskCategories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      // Add some sample categories if none exist
      setCategories([
        {
          id: "1",
          name: "Health Monitoring",
          color: "#ef4444",
        },
        {
          id: "2",
          name: "Safety Checks",
          color: "#f59e0b",
        },
        {
          id: "3",
          name: "Daily Living",
          color: "#10b981",
        },
      ])
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customTasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("taskCategories", JSON.stringify(categories))
  }, [categories])

  const addTask = (task: CustomTask) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTasks([...tasks, task])
      setIsLoading(false)
    }, 500)
  }

  const removeTask = (id: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTasks(tasks.filter((task) => task.id !== id))
      setIsLoading(false)
    }, 500)
  }

  const addCategory = (category: TaskCategory) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCategories([...categories, category])
      setIsLoading(false)
    }, 500)
  }

  const removeCategory = (id: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCategories(categories.filter((category) => category.id !== id))
      setIsLoading(false)
    }, 500)
  }

  return {
    tasks,
    categories,
    addTask,
    removeTask,
    addCategory,
    removeCategory,
    isLoading,
  }
}
