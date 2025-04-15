// import { Request, Response } from "express"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export const createInvoice = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { clientId, amount, description, dueDate, paymentMethod } = req.body

//         // TODO: Get agencyId from authenticated user
//         const agencyId = "agency1" // This should come from the authenticated user

//         const invoice = await prisma.invoice.create({
//             data: {
//                 agencyId,
//                 clientId,
//                 amount,
//                 description,
//                 dueDate: new Date(dueDate),
//                 status: "OPEN",
//             },
//         })

//         res.status(201).json(invoice)
//     } catch (error) {
//         console.error("Error creating invoice:", error)
//         res.status(500).json({ message: "Error creating invoice", error })
//     }
// } 