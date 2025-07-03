import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';

const questionService = new QuestionService();

export const getAllQuestions = async (_req: Request, res: Response) => {
    try {
        const questions = await questionService.findAll();
        res.json({
            success: true,
            data: questions,
            message: 'Questões encontradas com sucesso'
        });
    } catch (error) {
        console.error('Erro no controller de questões:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao buscar questões',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const question = await questionService.create(req.body);
        res.status(201).json({
            success: true,
            data: question,
            message: 'Questão criada com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questionário não encontrado') {
            return res.status(404).json({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao criar questão',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};