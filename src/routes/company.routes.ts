import { Router } from 'express';
import { getAllCompanies } from '../controllers/company.controller';

const router = Router();

router.get('/companies', getAllCompanies);

export default router;