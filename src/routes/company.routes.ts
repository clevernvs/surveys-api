import { Router } from 'express';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
} from '../controllers/company.controller';
import { validateZod, validateParams } from '../middleware/zod-validation.middleware';
import { CreateCompanySchema, UpdateCompanySchema, CompanyIdSchema } from '../schemas/company.schema';

const router = Router();

// Rotas para empresas
router.get('/companies', getAllCompanies);
router.get('/companies/:id', validateParams(CompanyIdSchema), getCompanyById);
router.post('/companies', validateZod(CreateCompanySchema), createCompany);
router.put('/companies/:id', validateParams(CompanyIdSchema), validateZod(UpdateCompanySchema), updateCompany);
router.delete('/companies/:id', validateParams(CompanyIdSchema), deleteCompany);

export default router;