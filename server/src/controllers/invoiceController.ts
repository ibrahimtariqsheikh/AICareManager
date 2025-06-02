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
        const { 
            agencyId, 
            clientId, 
            description, 
            issueDate,
            dueDate, 
            paymentMethod,
            invoiceItems,
            taxRate,
            totalAmount,
            notes,
            fromHoursDate,
            toHoursDate
        } = req.body;
        
        // Validate required fields
        if (!agencyId || !clientId || !description || !issueDate || !dueDate || !paymentMethod) {
            res.status(400).json({ 
                message: "Missing required fields", 
                required: ["agencyId", "clientId", "description", "issueDate", "dueDate", "paymentMethod"] 
            });
            return;
        }

        // Validate invoice items
        if (!invoiceItems || !Array.isArray(invoiceItems) || invoiceItems.length === 0) {
            res.status(400).json({ message: "Invoice must have at least one item" });
            return;
        }

        const invoice = await prisma.invoice.create({
            data: {
                agencyId,
                clientId,
                description,
                issueDate: new Date(issueDate),
                dueDate: new Date(dueDate),
                paymentMethod,
                status: 'PENDING',
                taxRate: taxRate || 0,
                totalAmount,
                notes,
                fromHoursDate: fromHoursDate ? new Date(fromHoursDate) : null,
                toHoursDate: toHoursDate ? new Date(toHoursDate) : null,
                invoiceItems: {
                    create: invoiceItems.map((item: any) => ({
                        description: item.description,
                        quantity: item.quantity,
                        rate: item.rate,
                        amount: item.amount
                    }))
                }
            },
            include: {
                invoiceItems: true
            }
        });

        res.status(201).json({ invoice });
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ 
            message: "Error creating invoice", 
            error: error instanceof Error ? error.message : "Unknown error occurred" 
        });
    }
}


export const getInvoiceDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
            const { agencyId } = req.params;
            const invoices = await prisma.invoice.findMany({
                where: { agencyId: agencyId },
            })

            const revenue = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0)
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

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // First check if the invoice exists
        const invoice = await prisma.invoice.findUnique({
            where: { id }
        });

        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }

        // Delete the invoice
        await prisma.invoice.delete({
            where: { id }
        });

        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ message: "Error deleting invoice", error });
    }
}