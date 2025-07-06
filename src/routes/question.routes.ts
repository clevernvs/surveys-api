import { Router } from 'express';
import { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller';
import { CreateQuestionSchema, UpdateQuestionSchema } from '../schemas/question.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', validateZod(CreateQuestionSchema), createQuestion);
router.put('/questions/:id', validateZod(UpdateQuestionSchema), updateQuestion);
router.delete('/questions/:id', deleteQuestion);

export default router;