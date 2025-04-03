import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        console.log("Fetching dashboard data for user:", userId);

        // Get user with agency data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                agency: true,
            },
        });

        console.log("Found user:", user);

        if (!user) {
            console.log("User not found");
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.agencyId) {
            console.log("User has no agency ID");
            res.status(400).json({ message: "User is not associated with any agency" });
            return;
        }

        console.log("User's agency ID:", user.agencyId);

        // Get all users for the agency
        const users = await prisma.user.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                profile: true,
            },
        });
        console.log("Found users:", users.length);

        // Get all schedules for the agency
        const schedules = await prisma.schedule.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        console.log("Found schedules:", schedules.length);

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
        console.log("Found clients:", clients.length);

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
        console.log("Found care workers:", careWorkers.length);

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
        console.log("Found office staff:", officeStaff.length);

        // Get all reports for the agency
        const reports = await prisma.report.findMany({
            where: {
                client: {
                    agencyId: user.agencyId,
                },
            },
            include: {
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
        console.log("Found reports:", reports.length);

        // Get all documents for the agency
        const documents = await prisma.document.findMany({
            where: {
                agencyId: user.agencyId,
            },
        });
        console.log("Found documents:", documents.length);

        // Get all mileage records for the agency
        const mileageRecords = await prisma.mileageRecord.findMany({
            where: {
                agencyId: user.agencyId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        console.log("Found mileage records:", mileageRecords.length);

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
            clientName: `${schedule.client.firstName} ${schedule.client.lastName}`,
            clientId: schedule.client.id,
            careWorkerName: `${schedule.user.firstName} ${schedule.user.lastName}`,
            careWorkerId: schedule.user.id,
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

        console.log("Calculated stats:", stats);

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
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
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