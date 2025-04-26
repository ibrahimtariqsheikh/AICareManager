
import type { AppointmentEvent, StaffMember, Client, SidebarMode } from "./types"

export function filterEvents(
  events: AppointmentEvent[],
  careWorkers: StaffMember[],
  officeStaff: StaffMember[],
  clients: Client[],
  sidebarMode: SidebarMode,
): AppointmentEvent[] {
  if (!events || events.length === 0) {
    return []
  }

  const processedEvents = events.map((event) => {
    const parseISODate = (dateStr: string | Date) => {
      if (dateStr instanceof Date) return dateStr;
      
      const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
      const date = new Date(year, month - 1, day); 
      
      if (dateStr.length > 10) {
        const timeMatch = dateStr.match(/T(\d{2}):(\d{2}):(\d{2})/);
        if (timeMatch) {
          date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), Number(timeMatch[3]));
        }
      }
      
      return date;
    };
    
    return {
      ...event,
      start: parseISODate(event.start),
      end: parseISODate(event.end),
    };
  })

  const selectedCareWorkerIds = careWorkers.filter((staff) => staff.selected).map((staff) => staff.id)
  const selectedOfficeStaffIds = officeStaff.filter((staff) => staff.selected).map((staff) => staff.id)
  const selectedClientIds = clients.filter((client) => client.selected).map((client) => client.id)

  const noStaffFilters = selectedCareWorkerIds.length === 0 && selectedOfficeStaffIds.length === 0
  const noClientFilters = selectedClientIds.length === 0

  const filteredEvents = processedEvents.filter((event) => {
    if (sidebarMode === "clients") {
      return noClientFilters || selectedClientIds.includes(event.clientId)
    } else if (sidebarMode === "careworkers") {
      return noStaffFilters || selectedCareWorkerIds.includes(event.resourceId)
    } else if (sidebarMode === "officestaff") {
      return noStaffFilters || selectedOfficeStaffIds.includes(event.resourceId)
    }

    return true
  })


  return filteredEvents
}

export function getRandomColor(id: string): string {
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length] || "#6b7280"
}

export function getEventColor(type: string): string {
  switch (type) {
    case "APPOINTMENT":
      return "#4f46e5" 
    case "CHECKUP":
    case "WEEKLY_CHECKUP":
      return "#10b981" 
    case "EMERGENCY":
      return "#ef4444" 
    case "ROUTINE":
      return "#8b5cf6" 
    case "HOME_VISIT":
      return "#059669" 
    default:
      return "#6b7280" 
  }
}

export function getStaffColor(item: AppointmentEvent | StaffMember | Client, staffMembers?: StaffMember[]) {
    if ('resourceId' in item) {
        const staffMember = staffMembers?.find((s) => s.id === item.resourceId)
        const staffColor = staffMember?.color || "#888888"
        const staffName = staffMember ? `${staffMember.fullName}` : "Staff"
        return { staffColor, staffName }
    } else {
        const staffColor = item.color || "#888888"
        const staffName = `${item.fullName}`
        return { staffColor, staffName }
    }
}

