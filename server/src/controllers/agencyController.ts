import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();



/**
 * Create a new agency
 */
export const createAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            email,
            description,
            address,
            extension,
            mobileNumber,
            landlineNumber,
            website,
            logo,
            primaryColor,
            secondaryColor,
            hasScheduleV2,
            hasEMAR,
            hasFinance,
            isWeek1And2ScheduleEnabled,
            hasPoliciesAndProcedures,
            licenseNumber,
            timeZone,
            currency,
            maxUsers,
            maxClients,
            maxCareWorkers
        } = req.body;

        console.log("Creating agency with data:", {
            name,
            email,
            description
        });

        // Validate required fields
        if (!name) {
            console.error("Create Agency Error: Name is missing");
            res.status(400).json({ message: "Agency name is required" });
            return;
        }

        if (!email) {
            console.error("Create Agency Error: Email is missing");
            res.status(400).json({ message: "Agency email is required" });
            return;
        }

        const agency = await prisma.agency.create({
            data: {
                name,
                email,
                description,
                address,
                extension,
                mobileNumber,
                landlineNumber,
                website,
                logo,
                primaryColor,
                secondaryColor,
                hasScheduleV2: hasScheduleV2 ?? true,
                hasEMAR: hasEMAR ?? false,
                hasFinance: hasFinance ?? false,
                isWeek1And2ScheduleEnabled: isWeek1And2ScheduleEnabled ?? false,
                hasPoliciesAndProcedures: hasPoliciesAndProcedures ?? false,
                licenseNumber,
                timeZone: timeZone || "UTC",
                currency: currency || "CAD",
                maxUsers,
                maxClients,
                maxCareWorkers
            }
        });

        console.log("Agency created successfully:", {
            agencyId: agency.id,
            name: agency.name,
            email: agency.email,
            createdAt: agency.createdAt
        });

        res.status(201).json(agency);
    } catch (error: any) {
        console.error("Error creating agency:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta,
            fullError: error,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: "Error creating agency", 
            error: error.message,
            details: error.meta,
            code: error.code
        });
    }
};

/**
 * Update an existing agency by ID
 */
export const updateAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            description,
            address,
            extension,
            mobileNumber,
            landlineNumber,
            website,
            logo,
            primaryColor,
            secondaryColor,
            isActive,
            isSuspended,
            hasScheduleV2,
            hasEMAR,
            hasFinance,
            isWeek1And2ScheduleEnabled,
            hasPoliciesAndProcedures,
            isTestAccount,
            licenseNumber,
            timeZone,
            currency,
            maxUsers,
            maxClients,
            maxCareWorkers
        } = req.body;

        console.log("Update Agency Request - ID:", id, "Data:", req.body);

        // Check if agency exists
        const existingAgency = await prisma.agency.findUnique({
            where: { id }
        });

        if (!existingAgency) {
            console.error("Update Agency Error: Agency not found", { id });
            res.status(404).json({ message: "Agency not found" });
            return;
        }

        const updatedAgency = await prisma.agency.update({
            where: { id },
            data: {
                name,
                email,
                description,
                address,
                extension,
                mobileNumber,
                landlineNumber,
                website,
                logo,
                primaryColor,
                secondaryColor,
                isActive,
                isSuspended,
                hasScheduleV2,
                hasEMAR,
                hasFinance,
                isWeek1And2ScheduleEnabled,
                hasPoliciesAndProcedures,
                isTestAccount,
                licenseNumber,
                timeZone,
                currency,
                maxUsers,
                maxClients,
                maxCareWorkers
            }
        });

        console.log("Agency updated successfully:", {
            agencyId: updatedAgency.id,
            name: updatedAgency.name,
            updatedAt: updatedAgency.updatedAt
        });

        res.json(updatedAgency);
    } catch (error: any) {
        console.error("Error updating agency:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta,
            fullError: error,
            requestParams: req.params,
            requestBody: req.body
        });
        res.status(500).json({ 
            message: "Error updating agency", 
            error: error.message,
            details: error.meta,
            code: error.code
        });
    }
};

/**
 * Delete an agency by ID
 */
export const deleteAgency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        console.log("Delete Agency Request - ID:", id);

        // Check if agency exists
        const existingAgency = await prisma.agency.findUnique({
            where: { id }
        });

        if (!existingAgency) {
            console.error("Delete Agency Error: Agency not found", { id });
            res.status(404).json({ message: "Agency not found" });
            return;
        }

        // Delete the agency
        await prisma.agency.delete({
            where: { id }
        });

        console.log("Agency deleted successfully:", { id });
        res.json({ message: "Agency deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting agency:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta,
            fullError: error,
            requestParams: req.params
        });
        res.status(500).json({ 
            message: "Error deleting agency", 
            error: error.message,
            details: error.meta,
            code: error.code
        });
    }
};

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
            include: {
               announcements: true,
               operatingHours: true,
               rateSheets: true,
               customTasks: true,
               groups: true,
               
            }
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
        const { include } = req.query;
        
        const groups = await prisma.group.findMany({
            where: { agencyId: id },
            include: include === 'clients' ? {
                clients: true
            } : undefined
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
        const { id: agencyId, groupId } = req.params;
        const { name, clientIds } = req.body;

        console.log("Update Group Request - Full Request:", {
            params: req.params,
            body: req.body,
            headers: req.headers
        });

        // Validate required fields
        if (!name) {
            console.error("Update Group Error: Name is missing");
            res.status(400).json({ message: "Group name is required" });
            return;
        }

        if (!clientIds || !Array.isArray(clientIds)) {
            console.error("Update Group Error: Invalid clientIds", { clientIds });
            res.status(400).json({ message: "Client IDs must be provided as an array" });
            return;
        }

        console.log("Updating group with data:", {
            groupId,
            name,
            agencyId,
            clientIds,
            clientCount: clientIds.length
        });

        // First, disconnect all existing clients
        await prisma.group.update({
            where: { id: groupId },
            data: {
                clients: {
                    set: []
                }
            }
        });

        // Then, connect the new clients and update the group
        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
                name,
                agencyId,
                clients: {
                    connect: clientIds.map((clientId: string) => ({ id: clientId }))
                }
            },
            select: {
                id: true,
                name: true,
                agencyId: true,
                createdAt: true,
                updatedAt: true,
                clients: true
            }
        });

        console.log("Group updated successfully:", {
            groupId: updatedGroup.id,
            name: updatedGroup.name,
            clientCount: updatedGroup.clients.length,
            createdAt: updatedGroup.createdAt,
            updatedAt: updatedGroup.updatedAt
        });

        res.json(updatedGroup);
    } catch (error: any) {
        console.error("Error updating group:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta,
            fullError: error,
            requestBody: req.body,
            requestParams: req.params
        });
        res.status(500).json({ 
            message: "Error updating group", 
            error: error.message,
            details: error.meta,
            code: error.code
        });
    }
};

// create group for agency
export const createAgencyGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, clientIds } = req.body;

        console.log("Create Group Request - Full Request:", {
            params: req.params,
            body: req.body,
            headers: req.headers
        });

        // Validate required fields
        if (!name) {
            console.error("Create Group Error: Name is missing");
            res.status(400).json({ message: "Group name is required" });
            return;
        }

        if (!clientIds || !Array.isArray(clientIds)) {
            console.error("Create Group Error: Invalid clientIds", { clientIds });
            res.status(400).json({ message: "Client IDs must be provided as an array" });
            return;
        }

        console.log("Creating group with data:", {
            name,
            agencyId: id,
            clientIds,
            clientCount: clientIds.length
        });

        const group = await prisma.group.create({
            data: {
                name,
                agencyId: id,
                clients: {
                    connect: clientIds.map((clientId: string) => ({ id: clientId }))
                }
            },
            select: {
                id: true,
                name: true,
                agencyId: true,
                createdAt: true,
                updatedAt: true,
                clients: true,
            }
        });

        console.log("Group created successfully:", {
            groupId: group.id,
            name: group.name,
            clientCount: group.clients.length,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        });

        res.status(201).json(group);
    } catch (error: any) {
        console.error("Error creating group:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta,
            fullError: error,
            requestBody: req.body,
            requestParams: req.params
        });
        res.status(500).json({ 
            message: "Error creating group", 
            error: error.message,
            details: error.meta,
            code: error.code
        });
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


