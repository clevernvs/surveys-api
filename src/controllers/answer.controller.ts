import { Request, Response } from 'express';
import { AnswerService } from '../services/answer.service';

const answerService = new AnswerService();

export const getAllAnswers = async (_req: Request, res: Response) => {
    try {
        const answers = await answerService.findAll();
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todas as perguntas' });
    }
};