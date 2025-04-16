import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();


export const deleteAgencyRateSheet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, rateSheetId } = req.params;
        await prisma.rateSheet.delete({
            where: { id: rateSheetId },
        });
        res.json({ message: "Rate sheet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting rate sheet", error: error });
    }
};



export const getAllAgencies = async (req: Request, res: Response): Promise<void> => {
    try {
        const agencies = await prisma.agency.findMany();
        res.json(agencies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching agencies", error: error });
    }
};

// get agency by id
export const getAgencyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const agency = await prisma.agency.findUnique({
            where: { id },
        });
        
        if (!agency) {
            res.status(404).json({ message: "Agency not found" });
            return;
        }
        
        res.json(agency);
    } catch (error) {
        res.status(500).json({ message: "Error fetching agency", error: error });
    }
};

// create agency
export const createAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, isActive, hasScheduleV2, hasEMAR, hasFinance } = req.body;
        const agency = await prisma.agency.create({
            data: { 
                name,
                isActive: isActive ?? true,
                hasScheduleV2: hasScheduleV2 ?? true,
                hasEMAR: hasEMAR ?? false,
                hasFinance: hasFinance ?? false
            },
        });
        res.status(201).json(agency);
    } catch (error) {
        res.status(500).json({ message: "Error creating agency", error: error });
    }
};

// update agency
export const updateAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const agency = await prisma.agency.update({
            where: { id },
            data: updateData,
        });
        
        res.json(agency);
    } catch (error) {
        res.status(500).json({ message: "Error updating agency", error: error });
    }
};

// delete agency
export const deleteAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.agency.delete({
            where: { id },
        });
        res.json({ message: "Agency deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting agency", error: error });
    }
};

// get all users by agency id
export const getAllUsersByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const users = await prisma.user.findMany({
            where: { agencyId: id },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error });
    }
};

// get all schedules by agency id
export const getAllSchedulesByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const schedules = await prisma.schedule.findMany({
            where: { agencyId: id },
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error: error });
    }
};

// get all clients by agency id
export const getAllClientsByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const clients = await prisma.user.findMany({
            where: { 
                agencyId: id,
                role: Role.CLIENT
            },
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching clients", error: error });
    }
};

// get all invoices by agency id
export const getAllInvoicesByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const invoices = await prisma.invoice.findMany({
            where: { agencyId: id },
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices", error: error });
    }
};

// get all mileage records by agency id
export const getAllMileageRecordsByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const mileageRecords = await prisma.mileageRecord.findMany({
            where: { agencyId: id },
        });
        res.json(mileageRecords);
    } catch (error) {
        res.status(500).json({ message: "Error fetching mileage records", error: error });
    }
};

// get all incident reports by agency id
export const getAllIncidentReportsByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const incidentReports = await prisma.incidentReport.findMany({
            where: { agencyId: id },
        });
        res.json(incidentReports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching incident reports", error: error });
    }
};

// get all medication records by agency id
export const getAllMedicationRecordsByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const medicationRecords = await prisma.medicationRecord.findMany({
            where: { 
                client: {
                    agencyId: id
                }
            },
        });
        res.json(medicationRecords);
    } catch (error) {
        res.status(500).json({ message: "Error fetching medication records", error: error });
    }
};

// get all documents by agency id
export const getAllDocumentsByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const documents = await prisma.document.findMany({
            where: { agencyId: id },
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error: error });
    }
};

// get all medication database links by agency id
export const getAllMedicationDatabaseLinksByAgencyId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const medicationDatabaseLinks = await prisma.medicationDatabaseLink.findMany({
            where: { agencyId: id },
        });
        res.json(medicationDatabaseLinks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching medication database links", error: error });
    }
};

// get all custom tasks by agency id
export const getAgencyCustomTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const customTasks = await prisma.customTask.findMany({
            where: { agencyId: id },
        });
        res.json(customTasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching custom tasks", error: error });
    }
};

// get all groups by agency id
export const getAgencyGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const groups = await prisma.group.findMany({
            where: { agencyId: id },
        });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error fetching groups", error: error });
    }
};

// get all rate sheets by agency id
export const getAgencyRateSheets = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const rateSheets = await prisma.rateSheet.findMany({
            where: { agencyId: id },
        });
        res.json(rateSheets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rate sheets", error: error });
    }
};

// update custom task for agency
export const updateAgencyCustomTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { task } = req.body;
        const updatedTask = await prisma.customTask.update({
            where: { id },
            data: task,
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating custom tasks", error: error });
    }
};


// update rate sheet for agency
export const updateAgencyRateSheet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: agencyId } = req.params;
        const { id: rateSheetId, name, hourlyRate, staffType } = req.body;
        const updatedRateSheet = await prisma.rateSheet.update({
            where: { id: rateSheetId },
            data: {
                name,
                hourlyRate,
                staffType
            },
        });
        res.json(updatedRateSheet);
    } catch (error) {
        res.status(500).json({ message: "Error updating rate sheet", error: error });
    }
};

// create rate sheet for agency
export const createAgencyRateSheet = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("createAgencyRateSheet", req.body)
        const { id } = req.params;
        const { name, hourlyRate, staffType } = req.body;
        const rateSheet = await prisma.rateSheet.create({
            data: {
                name,
                hourlyRate,
                staffType,
                agencyId: id
            },
        });
        res.status(201).json(rateSheet);
    } catch (error) {
        res.status(500).json({ message: "Error creating rate sheet", error: error });
    }
};

// update group for agency
export const updateAgencyGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: agencyId } = req.params;
        const { id: groupId, name, clientIds } = req.body;
        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
                name,
                agencyId,
                clients: {
                    set: clientIds ? clientIds.map((clientId: string) => ({ id: clientId })) : undefined
                }
            },
            include: {
                clients: true
            }
        });
        res.json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: "Error updating group", error: error });
    }
};

// create group for agency
export const createAgencyGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, clientIds } = req.body;
        const group = await prisma.group.create({
            data: {
                name,
                agencyId: id,
                clients: {
                    connect: clientIds ? clientIds.map((clientId: string) => ({ id: clientId })) : []
                }
            },
            include: {
                clients: true
            }
        });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error creating group", error: error });
    }
};

// delete group for agency
export const deleteAgencyGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupId } = req.params;
        await prisma.group.delete({
            where: { id: groupId },
        });
        res.json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error: error });
    }
};


