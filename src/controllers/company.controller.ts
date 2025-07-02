import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
import { CreateCompanyInput, UpdateCompanyInput } from '../schemas/company.schema';

const companyService = new CompanyService();

export const getAllCompanies = async (_req: Request, res: Response) => {
    try {
        const companies = await companyService.findAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
};

export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const company = await companyService.findById(Number(id));

        if (!company) {
            res.status(404).json({ error: 'Empresa não encontrada' });
            return;
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empresa' });
    }
};

export const createCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.body já está validado pelo middleware Zod
        const companyData: CreateCompanyInput = req.body;
        const company = await companyService.create(companyData);
        res.status(201).json(company);
    } catch (error: any) {
        console.error('Erro detalhado:', error);
        res.status(500).json({
            error: 'Erro ao criar empresa',
            details: error.message || 'Erro desconhecido'
        });
    }
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // req.body já está validado pelo middleware Zod
        const companyData: UpdateCompanyInput = req.body;
        const company = await companyService.update(Number(id), companyData);
        res.status(200).json(company);
    } catch (error: any) {
        console.error('Erro detalhado na atualização:', error);

        // Tratamento específico de erros
        if (error.message === 'Empresa não encontrada') {
            res.status(404).json({ error: 'Empresa não encontrada' });
            return;
        }

        res.status(500).json({
            error: 'Erro ao atualizar empresa',
            details: error.message || 'Erro desconhecido'
        });
    }
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await companyService.delete(Number(id));
        res.status(204).send();
    } catch (error: any) {
        console.error('Erro detalhado na exclusão:', error);

        // Tratamento específico de erros
        if (error.message === 'Empresa não encontrada') {
            res.status(404).json({ error: 'Empresa não encontrada' });
            return;
        }

        if (error.message.includes('projetos relacionados')) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(500).json({
            error: 'Erro ao deletar empresa',
            details: error.message || 'Erro desconhecido'
        });
    }
};