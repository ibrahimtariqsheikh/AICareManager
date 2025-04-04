import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class BaseController {
    protected prisma: PrismaClient;
    protected model: string;

    constructor(model: string) {
        this.prisma = new PrismaClient();
        this.model = model;
    }

    async create(req: Request, res: Response) {
        try {
            const result = await (this.prisma as any)[this.model].create({
                data: req.body,
            });
            return res.status(201).json(result);
        } catch (error) {
            console.error('Create error:', error);
            return res.status(500).json({ error: 'Failed to create record' });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const results = await (this.prisma as any)[this.model].findMany();
            return res.status(200).json(results);
        } catch (error) {
            console.error('Find all error:', error);
            return res.status(500).json({ error: 'Failed to fetch records' });
        }
    }

    async findOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await (this.prisma as any)[this.model].findUnique({
                where: { id },
            });
            if (!result) {
                return res.status(404).json({ error: 'Record not found' });
            }
            return res.status(200).json(result);
        } catch (error) {
            console.error('Find one error:', error);
            return res.status(500).json({ error: 'Failed to fetch record' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await (this.prisma as any)[this.model].update({
                where: { id },
                data: req.body,
            });
            return res.status(200).json(result);
        } catch (error) {
            console.error('Update error:', error);
            return res.status(500).json({ error: 'Failed to update record' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await (this.prisma as any)[this.model].delete({
                where: { id },
            });
            return res.status(204).send();
        } catch (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ error: 'Failed to delete record' });
        }
    }
} 