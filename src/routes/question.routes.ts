import { Router } from 'express';
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller';

const router = Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;