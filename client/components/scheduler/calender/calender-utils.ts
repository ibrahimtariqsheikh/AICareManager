
import type { AppointmentEvent, StaffMember, Client, SidebarMode } from "./types"

// Filter events based on selected staff, clients, and event types
export function filterEvents(
  events: AppointmentEvent[],
  careWorkers: StaffMember[],
  officeStaff: StaffMember[],
  clients: Client[],
  sidebarMode: SidebarMode,
): AppointmentEvent[] {
  // If there are no events, return empty array
  if (!events || events.length === 0) {
    return []
  }

  // Log for debugging
  console.log("Filtering events:", events.length)

  // Ensure dates are properly parsed
  const processedEvents = events.map((event) => ({
    ...event,
    start: event.start instanceof Date ? event.start : new Date(event.start),
    end: event.end instanceof Date ? event.end : new Date(event.end),
  }))

  const selectedCareWorkerIds = careWorkers.filter((staff) => staff.selected).map((staff) => staff.id)
  const selectedOfficeStaffIds = officeStaff.filter((staff) => staff.selected).map((staff) => staff.id)
  const selectedClientIds = clients.filter((client) => client.selected).map((client) => client.id)

  // If no filters are selected, show all events
  const noStaffFilters = selectedCareWorkerIds.length === 0 && selectedOfficeStaffIds.length === 0
  const noClientFilters = selectedClientIds.length === 0

  const filteredEvents = processedEvents.filter((event) => {
    // Apply different filters based on sidebar mode
    if (sidebarMode === "clients") {
      return noClientFilters || selectedClientIds.includes(event.clientId)
    } else if (sidebarMode === "careworkers") {
      return noStaffFilters || selectedCareWorkerIds.includes(event.resourceId)
    } else if (sidebarMode === "officestaff") {
      return noStaffFilters || selectedOfficeStaffIds.includes(event.resourceId)
    }

    // Default case - should not reach here
    return true
  })

  // Log filtered events for debugging
  console.log("Filtered events:", filteredEvents.length)

  return filteredEvents
}

// Helper function to get a random color based on ID
export function getRandomColor(id: string): string {
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length] || "#6b7280"
}

// Helper function to get event color based on type
export function getEventColor(type: string): string {
  switch (type) {
    case "APPOINTMENT":
      return "#4f46e5" // indigo
    case "CHECKUP":
    case "WEEKLY_CHECKUP":
      return "#10b981" // emerald
    case "EMERGENCY":
      return "#ef4444" // red
    case "ROUTINE":
      return "#8b5cf6" // purple
    case "HOME_VISIT":
      return "#059669" // green
    default:
      return "#6b7280" // gray
  }
}

export function getStaffColor(item: AppointmentEvent | StaffMember | Client, staffMembers?: StaffMember[]) {
    if ('resourceId' in item) {
        // This is an AppointmentEvent
        const staffMember = staffMembers?.find((s) => s.id === item.resourceId)
        const staffColor = staffMember?.color || "#888888"
        const staffName = staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : "Staff"
        return { staffColor, staffName }
    } else {
        // This is a StaffMember or Client
        const staffColor = item.color || "#888888"
        const staffName = `${item.firstName} ${item.lastName}`
        return { staffColor, staffName }
    }
}

