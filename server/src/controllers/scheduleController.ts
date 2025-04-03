import type { Request, Response } from "express"
import { PrismaClient, type ScheduleStatus, type ScheduleType, type Schedule, type User } from "@prisma/client"
import { format, parse } from "date-fns"

const prisma = new PrismaClient()

type ScheduleWithRelations = Schedule & {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    addressLine1?: string;
    townOrCity?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
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
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            addressLine1: true,
            townOrCity: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
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
      title: `${schedule.client.firstName} ${schedule.client.lastName} with ${schedule.user.firstName} ${schedule.user.lastName}`,
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
        firstName: schedule.user.firstName,
        lastName: schedule.user.lastName,
      },
      client: {
        firstName: schedule.client.firstName,
        lastName: schedule.client.lastName,
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

export const createSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      agencyId, 
      clientId, 
      userId, 
      date, 
      startTime,
      endTime,
      status, 
      type, 
      notes, 
      chargeRate 
    } = req.body

    // Validate required fields
    if (!agencyId || !clientId || !userId || !date || !startTime || !endTime || !status || !type) {
      res.status(400).json({ 
        message: "Missing required fields",
        required: ["agencyId", "clientId", "userId", "date", "startTime", "endTime", "status", "type"]
      })
      return
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      res.status(400).json({ message: "Invalid time format. Use HH:mm format" })
      return
    }

    // Parse and validate date range
    const appointmentDate = new Date(date)
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const startDateTime = new Date(appointmentDate)
    startDateTime.setHours(startHour, startMinute)

    const endDateTime = new Date(appointmentDate)
    endDateTime.setHours(endHour, endMinute)

    if (endDateTime <= startDateTime) {
      res.status(400).json({ message: "End time must be after start time" })
      return
    }

    // Check for overlapping schedules
    const overlappingSchedule = await prisma.schedule.findFirst({
      where: {
        userId,
        date: appointmentDate,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    })

    if (overlappingSchedule) {
      res.status(400).json({ message: "Schedule overlaps with existing appointment" })
      return
    }

    const schedule = await prisma.schedule.create({
      data: {
        agencyId,
        clientId,
        userId,
        date: appointmentDate,
        startTime,
        endTime,
        status: status as ScheduleStatus,
        type: mapFormTypeToDbType(type),
        notes,
        chargeRate: chargeRate ? Number.parseFloat(chargeRate) : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }) as ScheduleWithRelations

    // Format response to match frontend expectations
    const formattedSchedule = {
      id: schedule.id,
      title: `${schedule.client.firstName} ${schedule.client.lastName} with ${schedule.user.firstName} ${schedule.user.lastName}`,
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
        firstName: schedule.user.firstName,
        lastName: schedule.user.lastName,
      },
      client: {
        firstName: schedule.client.firstName,
        lastName: schedule.client.lastName,
      },
    }

    res.status(201).json(formattedSchedule)
  } catch (error) {
    console.error("Error creating schedule:", error)
    res.status(500).json({ message: "Error creating schedule", error })
  }
}

export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { 
      clientId, 
      userId, 
      date, 
      startTime,
      endTime,
      status, 
      type, 
      notes, 
      chargeRate 
    } = req.body

    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    })

    if (!existingSchedule) {
      res.status(404).json({ message: "Schedule not found" })
      return
    }

    // Validate time format if provided
    if (startTime || endTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      if ((startTime && !timeRegex.test(startTime)) || (endTime && !timeRegex.test(endTime))) {
        res.status(400).json({ message: "Invalid time format. Use HH:mm format" })
        return
      }
    }

    // Check for overlapping schedules if time is being updated
    if (startTime && endTime) {
      const overlappingSchedule = await prisma.schedule.findFirst({
        where: {
          id: { not: id }, // Exclude current schedule
          userId: userId || existingSchedule.userId,
          date: date ? new Date(date) : existingSchedule.date,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            }
          ]
        }
      })

      if (overlappingSchedule) {
        res.status(400).json({ message: "Schedule overlaps with existing appointment" })
        return
      }
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        clientId,
        userId,
        date: date ? new Date(date) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        status: status as ScheduleStatus,
        type: type ? mapFormTypeToDbType(type) : undefined,
        notes,
        chargeRate: chargeRate ? Number.parseFloat(chargeRate) : undefined,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }) as ScheduleWithRelations

    // Format response to match frontend expectations
    const formattedSchedule = {
      id: updatedSchedule.id,
      title: `${updatedSchedule.client.firstName} ${updatedSchedule.client.lastName} with ${updatedSchedule.user.firstName} ${updatedSchedule.user.lastName}`,
      start: new Date(`${updatedSchedule.date.toISOString().split('T')[0]}T${updatedSchedule.startTime}`),
      end: new Date(`${updatedSchedule.date.toISOString().split('T')[0]}T${updatedSchedule.endTime}`),
      date: updatedSchedule.date,
      startTime: updatedSchedule.startTime,
      endTime: updatedSchedule.endTime,
      resourceId: updatedSchedule.userId,
      clientId: updatedSchedule.clientId,
      type: mapDbTypeToFormType(updatedSchedule.type as ScheduleType),
      status: updatedSchedule.status,
      notes: updatedSchedule.notes,
      color: getEventColor(updatedSchedule.type as ScheduleType),
      careWorker: {
        firstName: updatedSchedule.user.firstName,
        lastName: updatedSchedule.user.lastName,
      },
      client: {
        firstName: updatedSchedule.client.firstName,
        lastName: updatedSchedule.client.lastName,
      },
    }

    res.json(formattedSchedule)
  } catch (error) {
    console.error("Error updating schedule:", error)
    res.status(500).json({ message: "Error updating schedule", error })
  }
}

export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    })

    if (!existingSchedule) {
      res.status(404).json({ message: "Schedule not found" })
      return
    }

    await prisma.schedule.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    console.error("Error deleting schedule:", error)
    res.status(500).json({ message: "Error deleting schedule", error })
  }
}
