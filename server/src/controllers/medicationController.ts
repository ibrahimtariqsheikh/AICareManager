import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new medication record
export const createMedicationRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      medicationId,
      clientId,
      userId,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
      morningDose,
      lunchDose,
      eveningDose,
      bedtimeDose,
      asNeededDose
    } = req.body;

    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        medicationId,
        clientId,
        userId,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes,
        morningDose,
        lunchDose,
        eveningDose,
        bedtimeDose,
        asNeededDose
      }
    });

    res.status(201).json(medicationRecord);
  } catch (error) {
    console.error('Create medication record error:', error);
    res.status(500).json({ error: 'Failed to create medication record' });
  }
};

// Get all medication records for a client
export const getClientMedications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const medications = await prisma.medicationRecord.findMany({
      where: { clientId },
      include: {
        medication: true,
        administrationRecords: true
      }
    });

    res.status(200).json(medications);
  } catch (error) {
    console.error('Get client medications error:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
};

// Update a medication record
export const updateMedicationRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const medicationRecord = await prisma.medicationRecord.update({
      where: { id },
      data: updateData
    });

    res.status(200).json(medicationRecord);
  } catch (error) {
    console.error('Update medication record error:', error);
    res.status(500).json({ error: 'Failed to update medication record' });
  }
};

// Delete a medication record
export const deleteMedicationRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.medicationRecord.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete medication record error:', error);
    res.status(500).json({ error: 'Failed to delete medication record' });
  }
};

// Record medication administration
export const recordAdministration = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      medicationRecordId,
      administeredById,
      doseType,
      doseTaken,
      notes
    } = req.body;

    const administration = await prisma.medicationAdministration.create({
      data: {
        medicationRecordId,
        administeredById,
        administeredAt: new Date(),
        doseType,
        doseTaken,
        notes
      }
    });

    res.status(201).json(administration);
  } catch (error) {
    console.error('Record administration error:', error);
    res.status(500).json({ error: 'Failed to record medication administration' });
  }
};

// Get administration history for a medication record
export const getAdministrationHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicationRecordId } = req.params;
    const history = await prisma.medicationAdministration.findMany({
      where: { medicationRecordId },
      include: {
        administeredBy: {
          select: {
            id: true,
            fullName: true,
          }
        }
      },
      orderBy: {
        administeredAt: 'desc'
      }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Get administration history error:', error);
    res.status(500).json({ error: 'Failed to fetch administration history' });
  }
}; 