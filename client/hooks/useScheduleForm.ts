"use client"

import { useState } from "react"
import { useCreateScheduleMutation, useUpdateScheduleMutation, useDeleteScheduleMutation } from "../state/api"
import { toast } from "sonner"

export function useScheduleForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [createSchedule] = useCreateScheduleMutation()
  const [updateSchedule] = useUpdateScheduleMutation()
  const [deleteSchedule] = useDeleteScheduleMutation()

  const handleCreateSchedule = async (scheduleData: any) => {
    setIsLoading(true)
    try {
      await createSchedule(scheduleData).unwrap()
      toast.success("Schedule created successfully")
      return true
    } catch (error) {
      console.error("Failed to create schedule:", error)
      toast.error("Failed to create schedule")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSchedule = async (id: string, scheduleData: any) => {
    setIsLoading(true)
    try {
      await updateSchedule({ id, ...scheduleData }).unwrap()
      toast.success("Schedule updated successfully")
      return true
    } catch (error) {
      console.error("Failed to update schedule:", error)
      toast.error("Failed to update schedule")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteSchedule(id).unwrap()
      toast.success("Schedule deleted successfully")
      return true
    } catch (error) {
      console.error("Failed to delete schedule:", error)
      toast.error("Failed to delete schedule")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createSchedule: handleCreateSchedule,
    updateSchedule: handleUpdateSchedule,
    deleteSchedule: handleDeleteSchedule,
  }
}

