import type { Request, Response } from "express"
import { PrismaClient, type ScheduleStatus, type ScheduleType } from "@prisma/client"

const prisma = new PrismaClient()

export const getSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, type, limit = 100, offset = 0 } = req.query

    const where: any = {}

    if (status) where.status = status as ScheduleStatus
    if (type) where.type = type as ScheduleType

    // Get the user ID from the authenticated request
    // This would typically come from your auth middleware
    // const userId = req.user?.id
    // if (userId) where.userId = userId

    console.log("Fetching schedules with where clause:", where)

    const schedules = await prisma.schedule.findMany({
      where,
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
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        date: "desc",
      },
    })

    // Add clientName for easier display
    const formattedSchedules = schedules.map((schedule) => ({
      ...schedule,
      clientName: schedule.client ? `${schedule.client.firstName} ${schedule.client.lastName}` : "Unknown Client",
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

export const getSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        client: true,
        user: true,
      },
    })

    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" })
      return
    }

    res.json(schedule)
  } catch (error) {
    console.error("Error fetching schedule:", error)
    res.status(500).json({ message: "Error fetching schedule", error })
  }
}

export const createSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agencyId, clientId, userId, date, shiftStart, shiftEnd, status, type, notes, chargeRate } = req.body

    if (!clientId || !userId || !date || !shiftStart || !shiftEnd || !status || !type) {
      res.status(400).json({ message: "Missing required fields" })
      return
    }

    const schedule = await prisma.schedule.create({
      data: {
        agencyId,
        clientId,
        userId,
        date: new Date(date),
        shiftStart: new Date(shiftStart),
        shiftEnd: new Date(shiftEnd),
        status: status as ScheduleStatus,
        type: type as ScheduleType,
        notes,
        chargeRate: chargeRate ? Number.parseFloat(chargeRate) : undefined,
      },
    })

    res.status(201).json(schedule)
  } catch (error) {
    console.error("Error creating schedule:", error)
    res.status(500).json({ message: "Error creating schedule", error })
  }
}

export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { clientId, userId, date, shiftStart, shiftEnd, status, type, notes, chargeRate } = req.body

    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
    })

    if (!existingSchedule) {
      res.status(404).json({ message: "Schedule not found" })
      return
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        clientId,
        userId,
        date: date ? new Date(date) : undefined,
        shiftStart: shiftStart ? new Date(shiftStart) : undefined,
        shiftEnd: shiftEnd ? new Date(shiftEnd) : undefined,
        status: status as ScheduleStatus,
        type: type as ScheduleType,
        notes,
        chargeRate: chargeRate ? Number.parseFloat(chargeRate) : undefined,
      },
    })

    res.json(updatedSchedule)
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

export const getSchedulesByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params
    const { status, startDate, endDate, limit = 100, offset = 0 } = req.query

    const where: any = { clientId }

    if (status) where.status = status as ScheduleStatus

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate as string)
      if (endDate) where.date.lte = new Date(endDate as string)
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        user: {
          select: {
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
    })

    const total = await prisma.schedule.count({ where })

    res.json({
      data: schedules,
      meta: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    })
  } catch (error) {
    console.error("Error fetching client schedules:", error)
    res.status(500).json({ message: "Error fetching client schedules", error })
  }
}

export const getSchedulesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const { status, startDate, endDate, limit = 100, offset = 0 } = req.query

    const where: any = { userId }

    if (status) where.status = status as ScheduleStatus

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate as string)
      if (endDate) where.date.lte = new Date(endDate as string)
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            addressLine1: true,
            townOrCity: true,
            postalCode: true,
          },
        },
      },
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        date: "asc",
      },
    })

    const total = await prisma.schedule.count({ where })

    res.json({
      data: schedules,
      meta: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    })
  } catch (error) {
    console.error("Error fetching user schedules:", error)
    res.status(500).json({ message: "Error fetching user schedules", error })
  }
}

export const getSchedulesByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, status, limit = 100, offset = 0 } = req.query

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Both startDate and endDate are required" })
      return
    }

    const where: any = {}
    
    // Handle date range for both date and shiftStart fields
    where.OR = [
      {
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        }
      },
      {
        shiftStart: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        }
      }
    ]

    if (status) where.status = status as ScheduleStatus

    // Get the user ID from the authenticated request
    // This would typically come from your auth middleware
    // const userId = req.user?.id
    // if (userId) where.userId = userId

    console.log("Fetching schedules by date range with where clause:", JSON.stringify(where, null, 2))

    const schedules = await prisma.schedule.findMany({
      where,
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
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        shiftStart: "asc",
      },
    })

    // Add clientName for easier display
    const formattedSchedules = schedules.map((schedule) => ({
      ...schedule,
      clientName: schedule.client ? `${schedule.client.firstName} ${schedule.client.lastName}` : "Unknown Client"
    }))

    const total = await prisma.schedule.count({ where })

    console.log(`Found ${schedules.length} schedules by date range`)
    
    res.json({
      data: formattedSchedules,
      meta: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    })
  } catch (error) {
    console.error("Error fetching schedules by date range:", error)
    res.status(500).json({ message: "Error fetching schedules by date range", error })
  }
}
