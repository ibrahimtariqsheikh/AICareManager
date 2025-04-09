import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        tasksCompleted: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        caregiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        tasksCompleted: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        caregiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { clientId, userId, condition, summary, checkInTime, checkOutTime, checkInDistance, checkOutDistance, tasksCompleted } = req.body;

    const report = await prisma.report.create({
      data: {
        clientId,
        userId,
        condition,
        summary,
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        checkInDistance,
        checkOutDistance,
        tasksCompleted: {
          create: tasksCompleted.map((task: any) => ({
            taskName: task.taskName,
            completed: task.completed,
          })),
        },
      },
      include: {
        tasksCompleted: true,
        caregiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { condition, summary, checkInTime, checkOutTime, checkInDistance, checkOutDistance, tasksCompleted } = req.body;

    // First, delete existing tasks
    await prisma.reportTask.deleteMany({
      where: { reportId: id },
    });

    // Then update the report and create new tasks
    const report = await prisma.report.update({
      where: { id },
      data: {
        condition,
        summary,
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        checkInDistance,
        checkOutDistance,
        tasksCompleted: {
          create: tasksCompleted.map((task: any) => ({
            taskName: task.taskName,
            completed: task.completed,
          })),
        },
      },
      include: {
        tasksCompleted: true,
        caregiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete tasks first due to foreign key constraint
    await prisma.reportTask.deleteMany({
      where: { reportId: id },
    });

    // Then delete the report
    await prisma.report.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};