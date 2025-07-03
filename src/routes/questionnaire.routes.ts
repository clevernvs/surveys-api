import { Router } from 'express';
import { getAllQuestionnaires, getQuestionnaireById, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire, createTestData } from '../controllers/questionnaire.controller';
import { QuestionnaireSchema } from '../schemas/questionnaire.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/questionnaires', getAllQuestionnaires);
router.get('/questionnaires/:id', getQuestionnaireById);
router.post('/questionnaires', validateZod(QuestionnaireSchema), createQuestionnaire);
router.put('/questionnaires/:id', validateZod(QuestionnaireSchema), updateQuestionnaire);
router.delete('/questionnaires/:id', deleteQuestionnaire);
router.post('/test-data', createTestData);

export default router;