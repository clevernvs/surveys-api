import { Request, Response } from 'express';
import { QuestionnaireService } from '../services/questionnaire.service';

const questionnaireService = new QuestionnaireService();

export const getAllQuestionnaires = async (_req: Request, res: Response) => {
    try {
        const questionnaires = await questionnaireService.findAll();
        res.json({
            success: true,
            data: questionnaires,
            message: 'Questionários encontrados com sucesso'
        });
    } catch (error) {
        console.error('Erro no controller de questionários:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao buscar questionários',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getQuestionnaireById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        }

        const questionnaire = await questionnaireService.findById(id);
        res.json({
            success: true,
            data: questionnaire,
            message: 'Questionário encontrado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questionário não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao buscar questionário',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const createQuestionnaire = async (req: Request, res: Response): Promise<void> => {
    try {
        const questionnaire = await questionnaireService.create(req.body);
        res.status(201).json({
            success: true,
            data: questionnaire,
            message: 'Questionário criado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Projeto não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                message: 'O projeto especificado não existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao criar questionário',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const updateQuestionnaire = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        }

        const questionnaire = await questionnaireService.update(id, req.body);
        res.json({
            success: true,
            data: questionnaire,
            message: 'Questionário atualizado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Questionário não encontrado') {
                res.status(404).json({
                    success: false,
                    error: 'Questionário não encontrado',
                    message: 'O questionário especificado não existe'
                });
            }
            if (error.message === 'Projeto não encontrado') {
                res.status(404).json({
                    success: false,
                    error: 'Projeto não encontrado',
                    message: 'O projeto especificado não existe'
                });
            }
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao atualizar questionário',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const deleteQuestionnaire = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        }

        const result = await questionnaireService.delete(id);
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questionário não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao deletar questionário',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

// Função de teste removida - não compatível com o novo schema