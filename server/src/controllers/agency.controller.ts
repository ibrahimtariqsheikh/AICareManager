import { Request, Response } from 'express';
import { BaseController } from './base.controller';

export class AgencyController extends BaseController {
    constructor() {
        super('agency');
    }

    // Override findAll to include related data
    async findAll(req: Request, res: Response) {
        try {
            const agencies = await this.prisma.agency.findMany({
                include: {
                    users: true,
                    visitTypes: true,
                    riskCategories: true,
                },
            });
            return res.status(200).json(agencies);
        } catch (error) {
            console.error('Find all agencies error:', error);
            return res.status(500).json({ error: 'Failed to fetch agencies' });
        }
    }

    // Override findOne to include related data
    async findOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const agency = await this.prisma.agency.findUnique({
                where: { id },
                include: {
                    users: true,
                    visitTypes: true,
                    riskCategories: true,
                },
            });
            if (!agency) {
                return res.status(404).json({ error: 'Agency not found' });
            }
            return res.status(200).json(agency);
        } catch (error) {
            console.error('Find agency error:', error);
            return res.status(500).json({ error: 'Failed to fetch agency' });
        }
    }

    // Custom method to update agency features
    async updateFeatures(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                hasScheduleV2,
                hasEMAR,
                hasFinance,
                isWeek1And2ScheduleEnabled,
                hasPoliciesAndProcedures,
            } = req.body;

            const agency = await this.prisma.agency.update({
                where: { id },
                data: {
                    hasScheduleV2,
                    hasEMAR,
                    hasFinance,
                    isWeek1And2ScheduleEnabled,
                    hasPoliciesAndProcedures,
                },
            });

            return res.status(200).json(agency);
        } catch (error) {
            console.error('Update agency features error:', error);
            return res.status(500).json({ error: 'Failed to update agency features' });
        }
    }

    // Custom method to manage agency status
    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { isActive, isSuspended } = req.body;

            const agency = await this.prisma.agency.update({
                where: { id },
                data: {
                    isActive,
                    isSuspended,
                },
            });

            return res.status(200).json(agency);
        } catch (error) {
            console.error('Update agency status error:', error);
            return res.status(500).json({ error: 'Failed to update agency status' });
        }
    }
} 