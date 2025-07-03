import { Router } from 'express';
import { getAllAnswers, createAnswer, updateAnswer, deleteAnswer } from '../controllers/answer.controller';
import { CreateAnswerSchema } from '../schemas/answer.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/answers', getAllAnswers);
router.post('/answers', validateZod(CreateAnswerSchema), createAnswer);
router.put('/answers/:id', validateZod(CreateAnswerSchema), updateAnswer);
router.delete('/answers/:id', deleteAnswer);

export default router;