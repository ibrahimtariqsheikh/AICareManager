import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        tasksCompleted: true
      }
    });
    console.log("reports", reports);
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
        tasksCompleted: true,
        alerts: true,
        bodyMapObservations: true,
        medicationAdministrations: true,
        editHistory: true,
        
      }
    });
    res.json(report);
  } catch (error: any) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};
