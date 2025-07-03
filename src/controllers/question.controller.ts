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

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const question = await questionService.create(req.body);
        res.status(201).json({
            success: true,
            data: question,
            message: 'Questão criada com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questionário não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao criar questão',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
            return;
        }

        const question = await questionService.update(id, req.body);
        res.json({
            success: true,
            data: question,
            message: 'Questão atualizada com sucesso'
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Questão não encontrada') {
                res.status(404).json({
                    success: false,
                    error: 'Questão não encontrada',
                    message: 'A questão especificada não existe'
                });
                return;
            }
            if (error.message === 'Questionário não encontrado') {
                res.status(404).json({
                    success: false,
                    error: 'Questionário não encontrado',
                    message: 'O questionário especificado não existe'
                });
                return;
            }
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao atualizar questão',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
            return;
        }

        const result = await questionService.delete(id);
        res.json({
            success: true,
            data: result,
            message: 'Questão excluída com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questão não encontrada') {
            res.status(404).json({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao excluir questão',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};