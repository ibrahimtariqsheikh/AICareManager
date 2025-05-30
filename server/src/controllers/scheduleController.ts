import type { Request, Response } from "express"
import { PrismaClient, ScheduleStatus, type ScheduleType, type Schedule, type User } from "@prisma/client"
import { format, parse, isEqual } from "date-fns"

const prisma = new PrismaClient()

// Type definitions for request and response objects
//test
type CreateScheduleRequest = {
  agencyId: string
  clientId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: string
  type: string
  notes?: string
  chargeRate?: string
}

type UpdateScheduleRequest = Partial<Omit<CreateScheduleRequest, 'status'>> & {
  status?: string
}

type ScheduleResponse = {
  id: string
  title: string
  start: string | Date
  end: string | Date
  date: Date
  startTime: string
  endTime: string
  resourceId: string
  clientId: string
  type: string
  status: ScheduleStatus
  notes?: string | null
  color: string
  careWorker: {
    fullName: string
  }
  client: {
    fullName: string
  }
}

type ScheduleWithRelations = Schedule & {
  client: {
    id: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  user: {
    id: string;
    fullName: string;
  };
}

// Helper function to get event color based on type
const getEventColor = (type: ScheduleType): string => {
  switch (type) {
    case "APPOINTMENT":
      return "#4f46e5" // indigo
    case "WEEKLY_CHECKUP":
      return "#10b981" // emerald
    case "HOME_VISIT":
      return "#059669" // green
    case "OTHER":
      return "#6b7280" // gray
    default:
      return "#6b7280" // gray
  }
}

// Helper function to map form types to database types
const mapFormTypeToDbType = (formType: string): ScheduleType => {
  switch (formType) {
    case "CHECKUP":
    case "WEEKLY_CHECKUP":
      return "WEEKLY_CHECKUP"
    case "EMERGENCY":
    case "ROUTINE":
      return "APPOINTMENT"
    case "HOME_VISIT":
      return "HOME_VISIT"
    case "OTHER":
      return "OTHER"
    default:
      return "APPOINTMENT"
  }
}

// Helper function to map database types to form types
const mapDbTypeToFormType = (dbType: ScheduleType): string => {
  switch (dbType) {
    case "WEEKLY_CHECKUP":
      return "WEEKLY_CHECKUP"
    case "APPOINTMENT":
      return "APPOINTMENT"
    case "HOME_VISIT":
      return "HOME_VISIT"
    case "OTHER":
      return "OTHER"
    default:
      return "APPOINTMENT"
  }
}

// Improved helper function to check for overlapping schedules
// Returns all conflicts found to provide better error messages
const checkOverlappingSchedules = async (
  userId: string,
  clientId: string,
  date: Date,
  startTime: string,
  endTime: string,
  excludeScheduleId?: string
): Promise<{ hasOverlap: boolean; conflicts: Array<{type: string, id: string}> }> => {
  // Standardize date format for comparison
  const appointmentDate = new Date(date.toISOString().split('T')[0])
  
  // Query for both care worker and client conflicts in one go
  const existingSchedules = await prisma.schedule.findMany({
    where: {
      date: appointmentDate,
      id: excludeScheduleId ? { not: excludeScheduleId } : undefined,
      OR: [
        { userId },
        { clientId }
      ]
    }
  })
  
  const conflicts: Array<{type: string, id: string}> = []
  
  // Check for conflicts
  for (const schedule of existingSchedules) {
    // Skip if this is the schedule we're excluding
    if (excludeScheduleId && schedule.id === excludeScheduleId) continue
    
    // Convert time strings to comparable values (minutes since midnight)
    const newStart = timeStringToMinutes(startTime)
    const newEnd = timeStringToMinutes(endTime)
    const existingStart = timeStringToMinutes(schedule.startTime)
    const existingEnd = timeStringToMinutes(schedule.endTime)
    
    // Check if there's an overlap
    if (
      (newStart < existingEnd && newEnd > existingStart) || // Standard overlap check
      (newStart === existingStart && newEnd === existingEnd) // Exact same time
    ) {
      // Add care worker conflict
      if (schedule.userId === userId && !conflicts.some(c => c.type === "care worker" && c.id === userId)) {
        conflicts.push({ type: "care worker", id: userId })
      }
      
      // Add client conflict
      if (schedule.clientId === clientId && !conflicts.some(c => c.type === "client" && c.id === clientId)) {
        conflicts.push({ type: "client", id: clientId })
      }
    }
  }
  
  return { 
    hasOverlap: conflicts.length > 0, 
    conflicts 
  }
}

// Helper function to convert time string to minutes since midnight for easier comparison
function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}


export const getAgencySchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agencyId } = req.params
    const schedules = await prisma.schedule.findMany({
      where: {
        agencyId: agencyId as string
      },
      include: {
        client: true,
        user: true
      }
    })
    res.json(schedules)
  } catch (error) {
    console.error("Error fetching agency schedules:", error)
    res.status(500).json({ message: "Error fetching agency schedules", error })
  }
}
export const getSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      type, 
      userId,
      startDate,
      endDate,
      agencyId,
      limit = 100, 
      offset = 0 
    } = req.query

    const where: any = {
      agencyId: agencyId as string
    }

    if (status) where.status = status as ScheduleStatus
    if (type) where.type = mapFormTypeToDbType(type as string)
    if (userId) where.userId = userId as string
    
    // Add date range filtering
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    console.log("Fetching schedules with where clause:", where)

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        client:   true,
        user: true,
      },
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        date: "asc",
      },
    }) as ScheduleWithRelations[]

    // Format schedules for frontend display
    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      title: `${schedule.client.fullName} with ${schedule.user.fullName}`,
      start: schedule.startTime,
      end: schedule.endTime,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      resourceId: schedule.userId,
      clientId: schedule.clientId,
      type: mapDbTypeToFormType(schedule.type as ScheduleType),
      status: schedule.status,
      notes: schedule.notes,
      color: getEventColor(schedule.type as ScheduleType),
      careWorker: {
        fullName: schedule.user.fullName,
      },
      client: {
        fullName: schedule.client.fullName,
      },
    }))

    const total = await prisma.schedule.count({ where })

    console.log(`Found ${schedules.length} schedules`)
    
    res.json({
      data: formattedSchedules,
      meta: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    })
  } catch (error) {
    console.error("Error fetching schedules:", error)
    res.status(500).json({ message: "Error fetching schedules", error })
  }
}

export const createSchedule = async (req: Request<{}, {}, CreateScheduleRequest>, res: Response): Promise<void> => {
  // Create a transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    try {
      const { 
        agencyId, 
        clientId, 
        userId, 
        date, 
        startTime,
        endTime,
        status: statusStr, 
        type, 
        notes, 
        chargeRate 
      } = req.body

      // Validate required fields
      if (!agencyId || !clientId || !userId || !date || !startTime || !endTime || !statusStr || !type) {
        return {
          status: 400,
          body: { 
            message: "Missing required fields",
            required: ["agencyId", "clientId", "userId", "date", "startTime", "endTime", "status", "type"]
          }
        }
      }

      // Validate status
      const validStatus = Object.values(ScheduleStatus).find(s => s === statusStr)
      if (!validStatus) {
        return {
          status: 400,
          body: { 
            message: "Invalid status",
            validStatuses: Object.values(ScheduleStatus)
          }
        }
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return {
          status: 400,
          body: { message: "Invalid time format. Use HH:mm format" }
        }
      }

      // Parse and validate date range
      const appointmentDate = new Date(date)
      // Standardize date by removing time component
      appointmentDate.setUTCHours(0, 0, 0, 0)
      
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startDateTime = new Date(appointmentDate)
      startDateTime.setHours(startHour, startMinute)

      const endDateTime = new Date(appointmentDate)
      endDateTime.setHours(endHour, endMinute)

      if (endDateTime <= startDateTime) {
        return {
          status: 400,
          body: { message: "End time must be after start time" }
        }
      }

      // First perform a direct check for identical appointments to catch duplicates
      const identicalAppointment = await tx.schedule.findFirst({
        where: {
          userId,
          clientId,
          date: appointmentDate,
          startTime,
          endTime
        }
      })

      if (identicalAppointment) {
        return {
          status: 400,
          body: { 
            message: "An identical appointment already exists",
            existingId: identicalAppointment.id
          }
        }
      }

      // Check for overlapping schedules using the improved helper function
      const { hasOverlap, conflicts } = await checkOverlappingSchedules(
        userId,
        clientId,
        appointmentDate,
        startTime,
        endTime
      )

      if (hasOverlap) {
        return {
          status: 400,
          body: { 
            message: `Scheduling conflict detected`,
            conflicts
          }
        }
      }

      const schedule = await tx.schedule.create({
        data: {
          agencyId,
          clientId,
          userId,
          date: appointmentDate,
          startTime,
          endTime,
          status: validStatus as ScheduleStatus,
          type: mapFormTypeToDbType(type),
          notes: notes || undefined,
        },
        include: {
          client: true,
          user: true,
        },
      }) as ScheduleWithRelations

      // Format response to match frontend expectations
      const formattedSchedule: ScheduleResponse = {
        id: schedule.id,
        title: `${schedule.client.fullName} with ${schedule.user.fullName}`,
        start: schedule.startTime,
        end: schedule.endTime,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        resourceId: schedule.userId,
        clientId: schedule.clientId,
        type: mapDbTypeToFormType(schedule.type as ScheduleType),
        status: schedule.status as ScheduleStatus,
        notes: schedule.notes || undefined,
        color: getEventColor(schedule.type as ScheduleType),
        careWorker: {
          fullName: schedule.user.fullName,
        },
        client: {
          fullName: schedule.client.fullName,
        },
      }

      return {
        status: 201,
        body: formattedSchedule
      }
    } catch (error) {
      console.error("Error in transaction:", error)
      return {
        status: 500,
        body: { message: "Error creating schedule", error }
      }
    }
  })

  res.status(result.status).json(result.body)
}

export const updateSchedule = async (req: Request<{ id: string }, {}, UpdateScheduleRequest>, res: Response): Promise<void> => {
  // Create a transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    try {
      const { id } = req.params
      const { 
        clientId, 
        userId, 
        date, 
        startTime,
        endTime,
        status: statusStr, 
        type, 
        notes, 
        chargeRate 
      } = req.body

      // Check if schedule exists with a FOR UPDATE lock to prevent concurrent modifications
      const existingSchedule = await tx.schedule.findUnique({
        where: { id },
      })

      if (!existingSchedule) {
        return {
          status: 404,
          body: { message: "Schedule not found" }
        }
      }

      // Validate status if provided
      let validStatus: ScheduleStatus | undefined
      if (statusStr) {
        validStatus = Object.values(ScheduleStatus).find(s => s === statusStr)
        if (!validStatus) {
          return {
            status: 400,
            body: { 
              message: "Invalid status",
              validStatuses: Object.values(ScheduleStatus)
            }
          }
        }
      }

      // Validate time format if provided
      if (startTime || endTime) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if ((startTime && !timeRegex.test(startTime)) || (endTime && !timeRegex.test(endTime))) {
          return {
            status: 400,
            body: { message: "Invalid time format. Use HH:mm format" }
          }
        }
      }

      // Only check for overlaps if we're changing date, time, user, or client
      if (date || startTime || endTime || userId || clientId) {
        const appointmentDate = date ? new Date(date) : existingSchedule.date
        // Standardize date by removing time component
        appointmentDate.setUTCHours(0, 0, 0, 0)
        
        const appointmentStartTime = startTime || existingSchedule.startTime
        const appointmentEndTime = endTime || existingSchedule.endTime
        const appointmentUserId = userId || existingSchedule.userId
        const appointmentClientId = clientId || existingSchedule.clientId

        // Check for time validity
        const [startHour, startMinute] = appointmentStartTime.split(":").map(Number)
        const [endHour, endMinute] = appointmentEndTime.split(":").map(Number)

        const startDateTime = new Date(appointmentDate)
        startDateTime.setHours(startHour, startMinute)

        const endDateTime = new Date(appointmentDate)
        endDateTime.setHours(endHour, endMinute)

        if (endDateTime <= startDateTime) {
          return {
            status: 400,
            body: { message: "End time must be after start time" }
          }
        }

        // First perform a direct check for identical appointments to catch duplicates
        const identicalAppointment = await tx.schedule.findFirst({
          where: {
            userId: appointmentUserId,
            clientId: appointmentClientId,
            date: appointmentDate,
            startTime: appointmentStartTime,
            endTime: appointmentEndTime,
            id: { not: id }
          }
        })

        if (identicalAppointment) {
          return {
            status: 400,
            body: { 
              message: "An identical appointment already exists",
              existingId: identicalAppointment.id
            }
          }
        }

        // Check for overlapping schedules using the improved helper function
        const { hasOverlap, conflicts } = await checkOverlappingSchedules(
          appointmentUserId,
          appointmentClientId,
          appointmentDate,
          appointmentStartTime,
          appointmentEndTime,
          id // Exclude the current schedule from the check
        )

        if (hasOverlap) {
          return {
            status: 400,
            body: { 
              message: `Scheduling conflict detected`,
              conflicts
            }
          }
        }
      }

      const updatedSchedule = await tx.schedule.update({
        where: { id },
        data: {
          clientId,
          userId,
          date: date ? new Date(date) : undefined,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          status: validStatus as ScheduleStatus,
          type: type ? mapFormTypeToDbType(type) : undefined,
          notes: notes || undefined,
        },
        include: {
          client: true,
          user: true,
        },
      }) as ScheduleWithRelations

      // Format response to match frontend expectations
      const formattedSchedule: ScheduleResponse = {
        id: updatedSchedule.id,
        title: `${updatedSchedule.client.fullName} with ${updatedSchedule.user.fullName}`,
        start: new Date(`${updatedSchedule.date.toISOString().split('T')[0]}T${updatedSchedule.startTime}`),
        end: new Date(`${updatedSchedule.date.toISOString().split('T')[0]}T${updatedSchedule.endTime}`),
        date: updatedSchedule.date,
        startTime: updatedSchedule.startTime,
        endTime: updatedSchedule.endTime,
        resourceId: updatedSchedule.userId,
        clientId: updatedSchedule.clientId,
        type: mapDbTypeToFormType(updatedSchedule.type as ScheduleType),
        status: updatedSchedule.status as ScheduleStatus,
        notes: updatedSchedule.notes || undefined,
        color: getEventColor(updatedSchedule.type as ScheduleType),
        careWorker: {
          fullName: updatedSchedule.user.fullName,
        },
        client: {
          fullName: updatedSchedule.client.fullName,
        },
      }

      return {
        status: 200,
        body: formattedSchedule
      }
    } catch (error) {
      console.error("Error in transaction:", error)
      return {
        status: 500,
        body: { message: "Error updating schedule", error }
      }
    }
  })

  res.status(result.status).json(result.body)
}

export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const  id  = req.params.id
    console.log("deleting appointment", id)


   const existingSchedule = await prisma.schedule.findFirst({
    where: { id },
   })
   console.log("existingSchedule", existingSchedule)


    if (!existingSchedule) {
      res.status(404).json({ message: "Schedule not found" })
      return
    }

    await prisma.schedule.delete({
      where: { id },
    })

    res.status(200).json({ message: "Schedule Deleted Successfully" })
  } catch (error) {
    console.error("Error deleting schedule:", error)
    res.status(500).json({ message: "Error deleting schedule", error })
  }
}


export const getCareWorkerSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const schedules = await prisma.schedule.findMany({
      where: {
        userId: userId as string
      },
      include: {
        client: {
          include: {
            medications: true,
          },
        },
        visitType: {
          include: {
            assignedTasks: true,
          }
        },
      }
    })
    res.json(schedules)
  } catch (error) {
    console.error("Error fetching care worker schedules:", error)
    res.status(500).json({ message: "Error fetching care worker schedules", error })
  }
}

export const createLeaveEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, startDate, endDate, notes, payRate, eventType, color, agencyId } = req.body

    const leaveEvent = await prisma.leaveEvent.create({
      data: {
        userId,
        agencyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes,
        payRate: payRate ? parseFloat(payRate) : null,
        eventType,
        color
      }
    })

    res.status(201).json(leaveEvent)
  } catch (error) {
    console.error("Error creating leave event:", error)
    res.status(500).json({ message: "Error creating leave event", error })
  }
}

export const getAgencyLeaveEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agencyId } = req.params
    const leaveEvents = await prisma.leaveEvent.findMany({
      where: {
        agencyId: agencyId as string
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })
    res.json(leaveEvents)
  } catch (error) {
    console.error("Error fetching leave events:", error)
    res.status(500).json({ message: "Error fetching leave events", error })
  }
}

export const getUserLeaveEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const leaveEvents = await prisma.leaveEvent.findMany({
      where: {
        userId: userId as string
      },
      include: {
        agency: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    res.json(leaveEvents)
  } catch (error) {
    console.error("Error fetching leave events:", error)
    res.status(500).json({ message: "Error fetching leave events", error })
  }
}

export const deleteLeaveEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const existingLeaveEvent = await prisma.leaveEvent.findUnique({
      where: { id }
    })

    if (!existingLeaveEvent) {
      res.status(404).json({ message: "Leave event not found" })
      return
    }

    await prisma.leaveEvent.delete({
      where: { id }
    })

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting leave event:", error)
    res.status(500).json({ message: "Error deleting leave event", error })
  }
}
