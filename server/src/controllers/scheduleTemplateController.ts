import type { Request, Response } from "express"
import { PrismaClient, ScheduleType } from "@prisma/client"

const prisma = new PrismaClient()



export const createScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  console.log("Creating template:", req.body)
  const { name, description, agencyId, userId, isActive, lastUpdated } = req.body
  try {
    console.log("Creating template:", req.body)
    const template = await prisma.scheduleTemplate.create({
      data: { 
        name, 
        description, 
        agencyId, 
        userId, 
        isActive, 
        createdAt: new Date(), 
        updatedAt: lastUpdated || new Date()
      },
      include: {
        visits: true
      }
    })
    console.log("Template created:", template)
    res.status(201).json(template)
  } catch (error) {
    console.error("Error creating template:", error)
    res.status(400).json({ error: error })
  }
}


export const getScheduleTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, agencyId } = req.params
        const templates = await prisma.scheduleTemplate.findMany({
            where: {
                userId: userId,
                agencyId: agencyId
            },
            include: {
                visits: {
                    include: {
                        rateSheet: true,
                        clientVisitType: true
                    }
                }
            }
        })
        res.status(200).json(templates)
    } catch (error) {
        res.status(400).json({ error: "Failed to get templates" })
    }
}



export const updateScheduleTemplate = async (req: Request, res: Response): Promise<void> => {   
  const { id, name, description, visits, agencyId, userId, lastUpdated, isActive } = req.body

  try {
    console.log("Updating template with visits:", visits);
  
    const template = await prisma.$transaction(async (tx) => {
      await tx.templateVisit.deleteMany({
        where: { templateId: id }
      });

      const updatedTemplate = await tx.scheduleTemplate.update({
        where: { id },
        data: {
          name,
          description,
          agencyId,
          userId,
          isActive,
          updatedAt: new Date(lastUpdated),
          visits: {
            create: visits.map((visit: any) => {
              // Only use clientVisitTypeId if it's a valid UUID or cuid, not if it's a string enum like "WEEKLY_CHECKUP"
              const isValidId = visit.visitTypeId && typeof visit.visitTypeId === 'string' && 
                (visit.visitTypeId.includes('-') || visit.visitTypeId.startsWith('c'));
              
              return {
                day: visit.day,
                startTime: visit.startTime,
                endTime: visit.endTime,
                careWorkerId: visit.careWorkerId,
                careWorker2Id: visit.careWorker2Id,
                careWorker3Id: visit.careWorker3Id,
                rateSheetId: visit.rateSheetId,
                // Only include clientVisitTypeId if it's a valid ID
                ...(isValidId ? { clientVisitTypeId: visit.visitTypeId } : {}),
                name: "Visit",
                endStatus: "SAME_DAY",
              };
            })
          }
        },
        include: {
          visits: {
            include: {
              rateSheet: true,
              clientVisitType: true
            }
          }
        }
      });

      return updatedTemplate;
    });

    console.log("Template updated successfully:", template);
    res.status(200).json(template);
  } catch (error) {
    console.log("Error updating template:", error);
    res.status(400).json({ error: "Failed to update template", details: error });
  }
}

export const deleteScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  try {
    await prisma.scheduleTemplate.delete({
      where: { id }
    })
    res.status(200).json({ message: "Template deleted successfully" })
  } catch (error) {
    res.status(400).json({ error: "Failed to delete template", details: error })
  }
}

export const activateScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  const { id, userId } = req.params
  
  try {
    await prisma.scheduleTemplate.updateMany({
      where: { userId: userId },
      data: { isActive: false }
    })
    await prisma.scheduleTemplate.update({
      where: { id },
      data: { isActive: true }
    })
    res.status(200).json({ message: "Template activated successfully" })
  } catch (error) {
    res.status(400).json({ error: "Failed to activate template", details: error })
  }
}

export const deactivateScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  try {
 
    await prisma.scheduleTemplate.update({
      where: { id },
      data: { isActive: false }
    })

    res.status(200).json({ message: "Template deactivated successfully" })
  } catch (error) {
    res.status(400).json({ error: "Failed to deactivate template", details: error })
  }
}


export const applyScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  const { templateId } = req.params
  try {
    const template = await prisma.scheduleTemplate.findUnique({
      where: { id: templateId },
      include: { visits: true }
    })
    if (!template) {
      res.status(404).json({ error: "Template not found" })
      return
    }

    console.log("Template found:", template)
    console.log("Visits:", template.visits)

    // Ensure all required fields are present and valid
    const validVisits = template.visits.filter((visit: any) => {
      return visit.day && visit.startTime && visit.endTime && visit.careWorkerId
    })

    if (validVisits.length === 0) {
      res.status(400).json({ error: "No valid visits found in template" })
      return
    }

    // Map day strings to actual dates
    const daysMap: Record<string, number> = {
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
      SUNDAY: 0
    }

    const scheduleData = validVisits.map((visit: any) => {
      // Get the next occurrence of the day of the week
      const today = new Date()
      const dayNum = daysMap[visit.day]
      const daysUntilNext = (dayNum + 7 - today.getDay()) % 7
      const nextDate = new Date(today)
      nextDate.setDate(today.getDate() + daysUntilNext)
      
      return {
        agencyId: template.agencyId,
        clientId: template.userId,
        userId: visit.careWorkerId,
        date: nextDate,
        startTime: visit.startTime,
        endTime: visit.endTime,
        status: "PENDING",
        type: ScheduleType.HOME_VISIT,
        notes: "",
        chargeRate: 0,
        visitTypeId: visit.clientVisitTypeId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    console.log("Creating schedules with data:", scheduleData)

    const addUserSchedule = await prisma.schedule.createMany({
      data: scheduleData
    })

    res.status(200).json({ message: "Template applied successfully", addUserSchedule })
  } catch (error) {
    console.error("Error applying template:", error)
    res.status(400).json({ error: "Failed to apply template", details: error })
  }
}




