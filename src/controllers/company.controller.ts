import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';

const companyService = new CompanyService();

export const getAllCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await companyService.findAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
};