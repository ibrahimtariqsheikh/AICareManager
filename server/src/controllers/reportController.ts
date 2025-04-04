import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new care report with tasks
export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      clientId,
      userId,
      condition,
      summary,
      checkInTime,
      checkOutTime,
      checkInDistance,
      checkOutDistance,
      tasks
    } = req.body;

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
          create: tasks.map((task: string) => ({
            taskName: task,
            completed: false
          }))
        }
      },
      include: {
        tasksCompleted: true
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

// Get all reports for a client
export const getClientReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const reports = await prisma.report.findMany({
      where: { clientId },
      include: {
        tasksCompleted: true,
        caregiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Get client reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Get all reports by a caregiver
export const getCaregiverReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const reports = await prisma.report.findMany({
      where: { userId },
      include: {
        tasksCompleted: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Get caregiver reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

// Update a report
export const updateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.checkInTime) {
      updateData.checkInTime = new Date(updateData.checkInTime);
    }
    if (updateData.checkOutTime) {
      updateData.checkOutTime = new Date(updateData.checkOutTime);
    }

    const report = await prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        tasksCompleted: true
      }
    });

    res.status(200).json(report);
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

// Update task completion status
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    const task = await prisma.reportTask.update({
      where: { id: taskId },
      data: { completed }
    });

    res.status(200).json(task);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// Delete a report
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.report.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
}; 