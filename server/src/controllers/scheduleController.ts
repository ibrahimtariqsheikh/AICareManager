import type { Request, Response } from "express"
import { PrismaClient, type ScheduleStatus, type ScheduleType } from "@prisma/client"

const prisma = new PrismaClient()

export const getSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, type, agencyId, limit = 100, offset = 0 } = req.query

    const where: any = {}

    if (status) where.status = status as ScheduleStatus
    if (type) where.type = type as ScheduleType
    if (agencyId) where.agencyId = agencyId as string

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
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
        date: "desc",
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

    if (!agencyId || !clientId || !userId || !date || !shiftStart || !shiftEnd || !status || !type) {
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
    const { startDate, endDate, agencyId, status, limit = 100, offset = 0 } = req.query

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Both startDate and endDate are required" })
      return
    }

    const where: any = {
      date: {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      },
    }

    if (agencyId) where.agencyId = agencyId as string
    if (status) where.status = status as ScheduleStatus

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
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
    console.error("Error fetching schedules by date range:", error)
    res.status(500).json({ message: "Error fetching schedules by date range", error })
  }
}

