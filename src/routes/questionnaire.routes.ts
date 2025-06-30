import { Router } from 'express';
import { getAllQuestionnaires } from '../controllers/questionnaire.controller';

const router = Router();

router.get('/questionnaires', getAllQuestionnaires);

export default router;