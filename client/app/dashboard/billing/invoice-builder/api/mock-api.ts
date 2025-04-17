import type { Client, CareWorker, HoursEntry } from "../types"
import { differenceInDays } from "date-fns"

// Mock clients data
const mockClients: Client[] = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (416) 555-1234",
    address: "123 Main Street",
    city: "Toronto",
    state: "ON",
    postalCode: "M5V 2K4",
    country: "Canada",
    rates: {
      "Standard Care": 35.0,
      "Specialized Care": 45.0,
      "Overnight Care": 55.0,
      Transportation: 25.0,
    },
  },
  {
    id: "client-2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (416) 555-5678",
    address: "456 Queen Street",
    city: "Toronto",
    state: "ON",
    postalCode: "M5V 3L2",
    country: "Canada",
    rates: {
      "Standard Care": 38.0,
      "Specialized Care": 48.0,
      "Overnight Care": 58.0,
      Transportation: 28.0,
    },
  },
  {
    id: "client-3",
    name: "Robert Williams",
    email: "robert.williams@example.com",
    phone: "+1 (416) 555-9012",
    address: "789 King Street",
    city: "Toronto",
    state: "ON",
    postalCode: "M5V 1N8",
    country: "Canada",
    rates: {
      "Standard Care": 40.0,
      "Specialized Care": 50.0,
      "Overnight Care": 60.0,
      Transportation: 30.0,
    },
  },
]

// Mock care workers data
const mockCareWorkers: CareWorker[] = [
  {
    id: "worker-1",
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@example.com",
  },
  {
    id: "worker-2",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
  },
  {
    id: "worker-3",
    firstName: "Jessica",
    lastName: "Wilson",
    email: "jessica.wilson@example.com",
  },
]

// Function to generate random hours for a client
function generateRandomHours(clientId: string, startDate: Date, endDate: Date): HoursEntry[] {
  const result: HoursEntry[] = []
  const daysDiff = differenceInDays(endDate, startDate) + 1
  const serviceTypes = ["Standard Care", "Specialized Care", "Overnight Care", "Transportation"]

  // Generate 1-3 entries per day
  for (let i = 0; i < daysDiff; i++) {
    // Remove or use the currentDate variable
    // const currentDate = addDays(startDate, i)
    const entriesForDay = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < entriesForDay; j++) {
      const careWorkerId = mockCareWorkers[Math.floor(Math.random() * mockCareWorkers.length)].id
      // Ensure serviceType is not undefined by using a default value if needed
      const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)] || "Standard Care"
      const hours = Math.round((Math.random() * 4 + 1) * 2) / 2 // Random hours between 1-5 in 0.5 increments

      result.push({
        careWorkerId,
        serviceType,
        hours,
      })
    }
  }

  return result
}

// API functions
export async function fetchClients(): Promise<Client[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockClients
}

export async function fetchCareWorkers(): Promise<CareWorker[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCareWorkers
}

export async function fetchClientHours(clientId: string, startDate: Date, endDate: Date): Promise<HoursEntry[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return generateRandomHours(clientId, startDate, endDate)
}
