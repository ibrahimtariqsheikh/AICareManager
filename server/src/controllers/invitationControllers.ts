import type { Request, Response } from "express";
import { PrismaClient, Role, SubRole } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// Helper function to generate a random token
function generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export const createInvitation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { inviterUserId, email, role, subRole, expirationDays } = req.body;
        
        // Create invitation with subRole
        const invitation = await prisma.invitation.create({
            data: {
                email,
                role: role as Role,
                subRole: subRole as SubRole,
                token: generateToken(),
                expiresAt: new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000),
                inviterId: inviterUserId,
            },
        });

        res.status(201).json(invitation);
    } catch (error) {
        console.error("Error creating invitation:", error);
        res.status(500).json({ message: "Error creating invitation", error });
    }
}; 