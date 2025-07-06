import { Router } from 'express';
import { getAllAnswers, createAnswer, updateAnswer, deleteAnswer, getAnswerById } from '../controllers/answer.controller';
import { CreateAnswerSchema, UpdateAnswerSchema } from '../schemas/answer.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/answers', getAllAnswers);
router.get('/answers/:id', getAnswerById);
router.post('/answers', validateZod(CreateAnswerSchema), createAnswer);
router.put('/answers/:id', validateZod(UpdateAnswerSchema), updateAnswer);
router.delete('/answers/:id', deleteAnswer);

export default router;