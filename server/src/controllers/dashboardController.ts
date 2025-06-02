import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
     
        // Get user with agency data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                agency: true,
            },
        });


        if (!user) {
            console.log("User not found");
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.agencyId) {
            ("User has no agency ID");
            res.status(400).json({ message: "User is not associated with any agency" });
            return;
        }

        // Get all users for the agency
        const users = await prisma.user.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                profile: true,
            },
        });


        // Get all schedules for the agency
        const schedules = await prisma.schedule.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                client: true,
                user: true,
            },
        });
   

        // Get all clients for the agency
        const clients = await prisma.user.findMany({
            where: {
                agencyId: user.agencyId,
                role: Role.CLIENT,
            },
            include: {
                profile: true,
            },
        });
 

        // Get all care workers for the agency
        const careWorkers = await prisma.user.findMany({
            where: {
                agencyId: user.agencyId,
                role: Role.CARE_WORKER,
            },
            include: {
                profile: true,
            },
        });


        // Get all office staff for the agency
        const officeStaff = await prisma.user.findMany({
            where: {
                agencyId: user.agencyId,
                role: Role.OFFICE_STAFF,
            },
            include: {
                profile: true,
            },
        });
    

        // Get all reports for the agency
        const reports = await prisma.report.findMany({
            where: {
                client: {
                    agencyId: user.agencyId,
                },
            },
            include: {
                client: true,
                caregiver: true,
            },
        });


        // Get all documents for the agency
        const documents = await prisma.document.findMany({
            where: {
                agencyId: user.agencyId,
            },
        });


        // Get all mileage records for the agency
        const mileageRecords = await prisma.mileageRecord.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                client: true,
                user: true,
            },
        });
          

        // Get unread notifications for the user
        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id,
                read: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5, // Limit to 5 most recent notifications
        });

        // Transform schedules for frontend
        const transformedSchedules = schedules.map(schedule => ({
            id: schedule.id,
            title: schedule.type,
            clientName: `${schedule.client.fullName}`,
            clientId: schedule.client.id,
            careWorkerName: schedule.user ? `${schedule.user.fullName}` : 'Unassigned',
            careWorkerId: schedule.user?.id || 'unallocated',
            date: schedule.date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            type: schedule.type,
            status: schedule.status,
            location: "Client's Home",
            notes: schedule.notes || "",
        }));

        // Transform notifications for frontend
        const transformedNotifications = notifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            createdAt: notification.createdAt,
        }));

        // Calculate some statistics
        const stats = {
            totalClients: clients.length,
            totalCareWorkers: careWorkers.length,
            totalOfficeStaff: officeStaff.length,
            totalSchedules: schedules.length,
            totalReports: reports.length,
            totalDocuments: documents.length,
            totalMileageRecords: mileageRecords.length,
            unreadNotifications: notifications.length,
        };



        // Get upcoming schedules
        const upcomingSchedules = await prisma.schedule.findMany({
            where: {
                agencyId: user.agencyId,
                date: {
                    gte: new Date(),
                },
                status: {
                    in: ["PENDING", "CONFIRMED"],
                },
            },
            include: {
                client: true,
                user: true,
            },
            orderBy: {
                date: 'asc',
            },
            take: 10,
        });

        // Return all dashboard data
        res.json({
            user: {
                ...user,
                agency: user.agency,
            },
            stats: {
                totalClients: stats.totalClients,
                totalCareWorkers: stats.totalCareWorkers,
                totalOfficeStaff: stats.totalOfficeStaff,
                totalSchedules: stats.totalSchedules,
                totalReports: stats.totalReports,
                totalDocuments: stats.totalDocuments,
                totalMileageRecords: stats.totalMileageRecords,
                unreadNotifications: stats.unreadNotifications,
            },
            users,
            schedules: transformedSchedules,
            clients,
            careWorkers,
            officeStaff,
            reports,
            documents,
            mileageRecords,
            notifications: transformedNotifications,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ 
            message: "Error fetching dashboard data", 
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        });
    }
}; 