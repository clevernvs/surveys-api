import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';

const questionService = new QuestionService();

export const getAllQuestions = async (_req: Request, res: Response) => {
    try {
        const questions = await questionService.findAll();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};