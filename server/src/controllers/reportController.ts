import { Request, Response } from 'express';
import { Medication, PrismaClient, AlertStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getCareworkerReports = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const reports = await prisma.report.findMany({
      where: {
        userId: userId,
      },
      include: {
        client: true,
        caregiver: true,
        visitType: true,
        visitSnapshot: {
          include: {
            taskSnapshots: true
          }
        },
        medicationSnapshot: {
          include: {
            medication: {
              include: {
                logs: true
              }
            }
          }
        }
      }
    });
    res.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};




export const getAgencyReports = async (req: Request, res: Response) => {
  try {
    const agencyId = req.params.agencyId;
    const reports = await prisma.report.findMany({
      where: {
        agencyId: agencyId,
      },
      include: {
        client: true,
        caregiver: true,
        visitType: true,
        tasksCompleted: true,
        visitSnapshot: {
          include: {
            taskSnapshots: true
          }
        },
        medicationSnapshot: {
          include: {
            medication: {
              include: {
                logs: true
              }
            }
          }
        }
      }
    });
    res.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const reportId = req.params.id;
    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        client: true,
        caregiver: true,
        agency: true,
        visitType: true,
        tasksCompleted: true,
        alerts: true,
        bodyMapObservations: true,
        editHistory: true,
        visitSnapshot: {
          include: {
            taskSnapshots: true
          }
        },
        medicationSnapshot: {
          include: {
            medication: {
              include: {
                logs: true
              }
            }
          }
        }
      }
    });
    res.json(report);
  } catch (error: any) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { userId, agencyId, scheduleId } = req.params;
    const { 
      clientId, 
      caregiverId, 
      visitTypeId, 
      title, 
      condition, 
      summary, 
      checkInTime, 
      checkOutTime, 
      signatureImageUrl, 
      status,
      checkInDistance,
      checkOutDistance,
      checkInLocation,
      checkOutLocation,
      tasksCompleted,
      medicationSnapshot
    } = req.body;
    
    console.log(userId, agencyId, scheduleId);
    console.log(req.body);
    
    // Get visit type information if visitTypeId is provided
    let visitTypeData = null;
    if (visitTypeId) {
      visitTypeData = await prisma.visitType.findUnique({
        where: { id: visitTypeId },
        include: { 
          assignedTasks: true
        }
      });
    }

    // Create base report
    const report = await prisma.report.create({
      data: {
        clientId,
        userId: caregiverId || userId,
        agencyId,
        visitTypeId,
        title,
        condition,
        summary,
        checkInTime: new Date(checkInTime),
        checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
        signatureImageUrl,
        status: status || 'COMPLETED',
        checkInDistance,
        checkOutDistance,
        checkInLocation,
        checkOutLocation,
        lastEditedAt: new Date(),
        lastEditedBy: userId,
        lastEditReason: 'Initial visit report',
        
        // Create visit snapshot
        ...(visitTypeData && {
          visitSnapshot: {
            create: {
              visitTypeName: visitTypeData.name,
              visitTypeDescription: visitTypeData.description || null,
              // Create task snapshots for each task in the visit type
              taskSnapshots: {
                create: visitTypeData.assignedTasks.map(task => ({
                  originalTaskId: task.id,
                  taskType: task.type,
                  taskName: task.type.toString(),
                  careworkerNotes: task.careworkerNotes || null
                }))
              }
            }
          }
        }),
        
        // Create tasks completed
        ...(tasksCompleted && tasksCompleted.length > 0 && {
          tasksCompleted: {
            createMany: {
              data: tasksCompleted.map((task: any) => ({
                taskId: task.taskId,
                taskName: task.taskName,
                completed: task.completed,
                notes: task.notes,
                completedAt: new Date(),
                taskIcon: task.taskIcon,
                taskType: task.taskType
              }))
            }
          }
        })
      },
      include: {
        client: true,
        caregiver: true,
        visitType: true,
        tasksCompleted: true,
        visitSnapshot: {
          include: {
            taskSnapshots: true
          }
        }
      }
    });

    // Add medication snapshots in a separate operation if present in request
    if (medicationSnapshot && medicationSnapshot.length > 0) {
      for (const medication of medicationSnapshot) {
        await prisma.medicationSnapshot.create({
          data: {
            reportId: report.id,
            medicationId: medication.medicationId
          }
        });
      }
    }

    // Fetch the complete report again with all relationships
    const completeReport = await prisma.report.findUnique({
      where: { id: report.id },
      include: {
        client: true,
        caregiver: true,
        visitType: true,
        tasksCompleted: true,
        visitSnapshot: {
          include: {
            taskSnapshots: true
          }
        },
        medicationSnapshot: {
          include: {
            medication: true
          }
        }
      }
    });

    res.status(201).json(completeReport);
  } catch (error: any) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id, ...reportData } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: reportData,
    });

    res.json(report);
  } catch (error: any) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const reportId = req.params.id;

    await prisma.report.delete({
      where: { id: reportId },
    });

    res.status(204).json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};


export const resolveReportAlert = async (req: Request, res: Response) => {
  try {
    const alertId = req.params.alertId;
    const { description, resolvedById } = req.body;
    
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        description,
        resolvedAt: new Date(),
        status: AlertStatus.RESOLVED,
        resolvedBy: {
          connect: {
            id: resolvedById
          }
        }
      }
    });
    
    res.json(alert);
  } catch (error: any) {
    console.error('Error resolving report:', error);
    res.status(500).json({ error: 'Failed to resolve report' });
  }
};
