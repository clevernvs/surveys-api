import { Request, Response } from 'express';
import { QuestionnaireService } from '../services/questionnaire.service';

const questionnaireService = new QuestionnaireService();

export const getAllQuestionnaires = async (_req: Request, res: Response) => {
    try {
        const questionnaires = await questionnaireService.findAll();
        res.json(questionnaires);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};