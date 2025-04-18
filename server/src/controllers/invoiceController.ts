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

        res.status(200).json({ invoiceNumber: invoiceNumber?.id || 0 })
    } catch (error) {
        console.error("Error getting current invoice number:", error)
        res.status(500).json({ message: "Error getting current invoice number", error })
    }
}
