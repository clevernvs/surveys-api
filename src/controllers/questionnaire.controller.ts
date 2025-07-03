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