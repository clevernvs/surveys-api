import { Router } from 'express';
import { getAllAnswers, createAnswer } from '../controllers/answer.controller';
import { CreateAnswerSchema } from '../schemas/answer.schema';
import { validateZod } from '../middleware/zod-validation.middleware';

const router = Router();

router.get('/answers', getAllAnswers);
router.post('/answers', validateZod(CreateAnswerSchema), createAnswer);

export default router;