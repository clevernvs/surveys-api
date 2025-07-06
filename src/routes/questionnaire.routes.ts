import { Router } from 'express';
import { getAllQuestionnaires, getQuestionnaireById, createQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '../controllers/questionnaire.controller';
import { CreateQuestionnaireSchema, UpdateQuestionnaireSchema } from '../schemas/questionnaire.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/questionnaires', getAllQuestionnaires);
router.get('/questionnaires/:id', getQuestionnaireById);
router.post('/questionnaires', validateZod(CreateQuestionnaireSchema), createQuestionnaire);
router.put('/questionnaires/:id', validateZod(UpdateQuestionnaireSchema), updateQuestionnaire);
router.delete('/questionnaires/:id', deleteQuestionnaire);

export default router;