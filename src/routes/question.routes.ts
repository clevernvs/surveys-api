import { Router } from 'express';
import { getAllQuestions, createQuestion } from '../controllers/question.controller';

const router = Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);

export default router;