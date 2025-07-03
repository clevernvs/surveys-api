import { Router } from 'express';
import { getAllQuestions, createQuestion, updateQuestion } from '../controllers/question.controller';

const router = Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);

export default router;