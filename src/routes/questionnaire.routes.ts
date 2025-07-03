import { Router } from 'express';
import { getAllQuestionnaires, createQuestionnaire, createTestData } from '../controllers/questionnaire.controller';

const router = Router();

router.get('/questionnaires', getAllQuestionnaires);
router.post('/questionnaires', createQuestionnaire);
router.post('/test-data', createTestData);

export default router;