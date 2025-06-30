import { Router } from 'express';
import { getAllAnswers } from '../controllers/answer.controller';

const router = Router();

router.get('/answers', getAllAnswers);

export default router;