import { Router } from 'express';
import { getAllQuestions } from '../controllers/question.controller';

const router = Router();

router.get('/questions', getAllQuestions);

export default router;