import { Router } from 'express';
import { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller';

const router = Router();

router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;