import { Router } from 'express';
import {
    getAllFilters,
    getFilterById,
    createFilter,
    updateFilter,
    deleteFilter,
    getFiltersByQuestionnaire,
    getFiltersByGender,
    getFiltersByAgeRange,
    getFiltersBySocialClass,
    getFiltersByLocation
} from '../controllers/filter.controller';
import { CreateFilterSchema, UpdateFilterSchema } from '../schemas/filter.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

// Rotas específicas devem vir ANTES das rotas com parâmetros genéricos
router.get('/filters/questionnaire/:questionnaireId', getFiltersByQuestionnaire);
router.get('/filters/gender/:genderId', getFiltersByGender);
router.get('/filters/age-range/:ageRangeId', getFiltersByAgeRange);
router.get('/filters/social-class/:socialClassId', getFiltersBySocialClass);
router.get('/filters/location', getFiltersByLocation);

// Rotas CRUD básicas
router.get('/filters', getAllFilters);
router.get('/filters/:id', getFilterById);
router.post('/filters', validateZod(CreateFilterSchema), createFilter);
router.put('/filters/:id', validateZod(UpdateFilterSchema), updateFilter);
router.delete('/filters/:id', deleteFilter);

export default router; 