import { Router } from 'express';
import { getAllQuestionnaires, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire, createTestData } from '../controllers/questionnaire.controller';

const router = Router();

router.get('/questionnaires', getAllQuestionnaires);
router.post('/questionnaires', createQuestionnaire);
router.put('/questionnaires/:id', updateQuestionnaire);
router.delete('/questionnaires/:id', deleteQuestionnaire);
router.post('/test-data', createTestData);

export default router;