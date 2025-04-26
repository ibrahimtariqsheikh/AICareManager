
import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()



export const createScheduleTemplate = async (req: Request, res: Response): Promise<void> => {
  console.log("Creating template:", req.body)
  const { name, description,  agencyId, userId, isActive, lastUpdated } = req.body
  try {
    console.log("Creating template:", req.body)
    const template = await prisma.scheduleTemplate.create({
      data: { name, description, visits: { create: [] }, agencyId, userId, isActive, createdAt: new Date(), updatedAt: lastUpdated},
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
                visits: true
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
            create: visits.map((visit: any) => ({
              day: visit.day,
              startTime: visit.startTime,
              endTime: visit.endTime,
              careWorkerId: visit.careWorker,
              careWorker2Id: visit.careWorker2,
              careWorker3Id: visit.careWorker3,
              name: "Visit",
              endStatus: "SAME_DAY",
            }))
          }
        },
        include: {
          visits: true
        }
      });

      return updatedTemplate;
    });

    console.log("Template updated successfully:", template);
    res.status(200).json(template);
  } catch (error) {
    console.error("Error updating template:", error);
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




