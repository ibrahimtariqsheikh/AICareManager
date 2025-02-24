import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await prisma.user.findMany();
    res.json(users);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cognitoId, email, password } = req.body;
        const user = await prisma.user.create({
            data: { cognitoId, email, password },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { cognitoId } = req.params;
    const user = await prisma.user.findUnique({
        where: { cognitoId },
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user);
};
