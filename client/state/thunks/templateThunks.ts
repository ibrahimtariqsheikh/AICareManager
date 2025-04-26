import { createAsyncThunk } from "@reduxjs/toolkit"
import { applyTemplateToSchedule } from "../slices/templateSlice"
import { addEvent, clearEventsForDate } from "../slices/scheduleSlice"

import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import type { AppointmentEvent } from "../../components/scheduler/calender/types"
import { RootState } from "../redux"

// Thunk to apply a template to a specific date
export const applyTemplateToDay = createAsyncThunk(
  "templates/applyTemplateToDay",
  async (
    { templateId, date, clientId }: { templateId: string; date: string; clientId: string },
    { getState, dispatch },
  ) => {
    try {
      const state = getState() as RootState

      // Find the template
      const template = state.template.templates.find((t) => t.id === templateId)
      if (!template) {
        throw new Error("Template not found")
      }

      // Get the client
      const client = state.user.clients.find((c) => c.id === clientId)
      if (!client) {
        throw new Error("Client not found")
      }

      // First, clear existing events for this date
      dispatch(clearEventsForDate(date))

      // Parse the target date
      const targetDate = moment(date)

      // Convert template visits to events
      const events: AppointmentEvent[] = template.visits.map((visit) => {
        // Get the day of week from the visit
        const visitDay = visit.day.toUpperCase()

        // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
        const dayMap: Record<string, number> = {
          SUNDAY: 0,
          MONDAY: 1,
          TUESDAY: 2,
          WEDNESDAY: 3,
          THURSDAY: 4,
          FRIDAY: 5,
          SATURDAY: 6,
        }

        // Find the closest date that matches the day of week
        const dayNumber = dayMap[visitDay]
        if (dayNumber === undefined) {
          throw new Error(`Invalid day: ${visitDay}`)
        }

        // Clone the target date and set to the correct day of week
        const eventDate = targetDate.clone()

        // Parse start and end times
        const [startHour, startMinute] = visit.startTime.split(":").map(Number)
        const [endHour, endMinute] = visit.endTime.split(":").map(Number)

        // Create start and end dates
        const start = eventDate.clone().hour(startHour ?? 0).minute(startMinute ?? 0).second(0)
        const end = eventDate.clone().hour(endHour ?? 0).minute(endMinute ?? 0).second(0)

        // Create the event
        return {
          id: uuidv4(),
          title: `Visit: ${client.fullName}`,
          start: start.toDate(),
          end: end.toDate(),
          date: eventDate.toDate(),
          startTime: visit.startTime,
          endTime: visit.endTime,
          resourceId: uuidv4(),
          clientId: clientId,
          type: "HOME_VISIT", // Default type
          status: "SCHEDULED",
          notes: `Applied from template: ${template.name}`,
          color: "#059669", // green for HOME_VISIT
          careWorker: {
            id: uuidv4(),
            fullName: visit.careWorker,
          },
          client: client,
        }
      })

      // Add all events to the schedule
      events.forEach((event) => {
        dispatch(addEvent(event))
      })

      // Mark the template as applied
      dispatch(applyTemplateToSchedule({ templateId, date }))

      return { success: true, eventsAdded: events.length }
    } catch (error) {
      console.error("Error applying template:", error)
      throw error
    }
  },
)
