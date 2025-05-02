import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMedication = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { name, dosage, frequency, instructions, morning, afternoon, evening, bedtime, asNeeded } = req.body;
        const medication = await prisma.medication.create({
            data: {
                name,
                dosage,
                frequency,
                instructions,
                morning,
                afternoon,
                evening,
                bedtime,
                asNeeded,
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json(medication);
    } catch (error) {
        console.error('Error creating medication:', error);
        res.status(500).json({ error: 'Failed to create medication' });
    }
};

export const getMedications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const medications = await prisma.medication.findMany({
            where: { userId },
        });
        res.status(200).json(medications);
    } catch (error) {
        console.error('Error getting medications:', error);
        res.status(500).json({ error: 'Failed to get medications' });
    }

};

export const updateMedication = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, dosage, frequency, instructions, morning, afternoon, evening, bedtime, asNeeded } = req.body;
    try {
        const medication = await prisma.medication.update({
            where: { id },
            data: { name, dosage, frequency, instructions, morning, afternoon, evening, bedtime, asNeeded },
        });
        res.status(200).json(medication);
    } catch (error) {
        console.error('Error updating medication:', error);
        res.status(500).json({ error: 'Failed to update medication' });
    }
};

export const deleteMedication = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const medication = await prisma.medication.delete({
            where: { id },
        });
        res.status(200).json(medication);
    } catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Failed to delete medication' });
    }
};

export const createMedicationLog = async (req: Request, res: Response) => {
    const { medicationId, userId } = req.params;
    const { date, status, time, careworkerId, notes } = req.body;
    try {
        const medicationLog = await prisma.medicationLog.create({
            data: { medication: { connect: { id: medicationId } }, date, status, time, careworkerId, notes, user: { connect: { id: userId } } },
        });
        res.status(201).json(medicationLog);
    } catch (error) {
        console.error('Error creating medication log:', error);
        res.status(500).json({ error: 'Failed to create medication log' });
    }
};

export const checkInMedication = async (req: Request, res: Response) => {
    const { medicationId, userId } = req.params;
    const { date, time, status, notes } = req.body;
    
    try {
        const medicationLog = await prisma.medicationLog.create({
            data: {
                medication: { connect: { id: medicationId } },
                user: { connect: { id: userId } },
                date: date, 
                time,
                status,
                notes: notes || null,
            },
        });
        
        res.status(201).json(medicationLog);
    } catch (error) {
        console.error('Error checking in medication:', error);
        res.status(500).json({ error: 'Failed to check in medication' });
    }
};