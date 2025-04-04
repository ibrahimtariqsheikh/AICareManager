import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Upload a new document
export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      fileUrl,
      userId,
      clientId,
      agencyId
    } = req.body;

    const document = await prisma.document.create({
      data: {
        title,
        fileUrl,
        userId,
        clientId,
        agencyId
      }
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Get documents for a user
export const getUserDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get documents for a client
export const getClientDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const documents = await prisma.document.findMany({
      where: { clientId },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Get client documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get documents for an agency
export const getAgencyDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agencyId } = req.params;
    const documents = await prisma.document.findMany({
      where: { agencyId },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Get agency documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Update document details
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const document = await prisma.document.update({
      where: { id },
      data: { title }
    });

    res.status(200).json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

// Delete a document
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.document.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
}; 