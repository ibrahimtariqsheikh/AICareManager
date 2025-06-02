import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const getCurrentInvoiceNumber = async (req: Request, res: Response): Promise<void> => {
    try {
        const invoiceNumber = await prisma.invoice.findFirst({
            orderBy: {
                id: 'desc'
            },
        })
        res.status(200).json({ invoiceNumber: invoiceNumber?.invoiceNumber || 0 })
    } catch (error) {
        console.error("Error getting current invoice number:", error)
        res.status(500).json({ message: "Error getting current invoice number", error })
    }
}

export const createPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, agencyId, expensesFromDate, expensesToDate, scheduleFromDate, scheduleToDate, calculatedScheduleHours, calculatedExpenses, totalEarnings, totalDeductions, netPay, taxRate } = req.body;
        
        const payroll = await prisma.payroll.create({
            data: {
                userId,
                agencyId,
                expensesFromDate: new Date(expensesFromDate),
                expensesToDate: new Date(expensesToDate),
                scheduleFromDate: new Date(scheduleFromDate),
                scheduleToDate: new Date(scheduleToDate),
                calculatedScheduleHours,
                calculatedExpenses,
                totalEarnings,
                totalDeductions,
                netPay,
                taxRate
            },
            include: {
                user: true
            }
        });

        res.status(200).json({ payroll });
    } catch (error) {
        res.status(500).json({ message: "Error creating payroll", error });
    }
}

export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, associatedEntity, category, description, amount, date, agencyId, userId } = req.body;
        
        // Convert associatedEntity to proper enum format
        const formattedAssociatedEntity = associatedEntity === 'CAREWORKER' ? 'CARE_WORKER' : associatedEntity;
        
        const expense = await prisma.expenses.create({
            data: {
                type,
                associatedEntity: formattedAssociatedEntity,
                category,
                description,
                amount,
                date: new Date(date),
                agencyId,
                userId
            }
        });

        res.status(201).json({ expense });
    } catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ message: "Error creating expense", error });
    }
}

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
        const { agencyId, clientId, amount, description, dueDate, paymentMethod } = req.body;
        
        const invoice = await prisma.invoice.create({
            data: {
                agencyId,
                clientId,
                amount,
                description,
                dueDate: new Date(dueDate),
                paymentMethod,
                status: 'PENDING'
            }
        });

        res.status(201).json({ invoice });
    } catch (error) {
        res.status(500).json({ message: "Error creating invoice", error });
    }
}


export const getInvoiceDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
            const { agencyId } = req.params;
            const invoices = await prisma.invoice.findMany({
                where: { agencyId: agencyId },
            })

            const revenue = invoices.reduce((acc, invoice) => acc + invoice.amount, 0)
            const numberOfClients = await prisma.user.count({
                where: { agencyId: agencyId },
            })
            const expenses = await prisma.expenses.aggregate({
                where: { agencyId: agencyId },
                _sum: {
                    amount: true
                }
            })

        

        res.status(200).json({ numberOfInvoices: invoices.length, revenue: revenue, numberOfClients: numberOfClients, numberOfExpenses : expenses._sum.amount || 0 })
    } catch (error) {
        res.status(500).json({ message: "Error getting invoice dashboard data", error })
    }
}


export const getExpensesByDateRange = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;
        const expenses = await prisma.expenses.findMany({
            where: { date: { gte: new Date(startDate as string), lte: new Date(endDate as string) } },
        })
        
        // Calculate total amount from all expenses
        const totalAmount = expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
        
        res.status(200).json({ totalAmount })
    } catch (error) {
        res.status(500).json({ message: "Error getting expenses by date range", error })
    }
}

export const getScheduleHoursByDateRange = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;
        const scheduleHours = await prisma.schedule.findMany({
            where: { date: { gte: new Date(startDate as string), lte: new Date(endDate as string) } },
            include: { rateSheet: true }
        })
        
        // Calculate total hours and pay rate from startTime and endTime
        const totalHours = scheduleHours.reduce((acc, schedule) => {
            const start = new Date(`1970-01-01T${schedule.startTime}`);
            const end = new Date(`1970-01-01T${schedule.endTime}`);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return acc + hours;
        }, 0);

        // Calculate average pay rate
        const payRates = scheduleHours
            .map(schedule => schedule.rateSheet?.hourlyRate || 0)
            .filter(rate => rate > 0);
        const payRate = payRates.length > 0 
            ? payRates.reduce((acc, rate) => acc + rate, 0) / payRates.length 
            : 0;
   
        res.status(200).json({ totalHours, payRate })
    } catch (error) {
        res.status(500).json({ message: "Error getting schedule hours by date range", error })
    }
}