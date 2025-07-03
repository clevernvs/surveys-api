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

export const createAnswer = async (req: Request, res: Response) => {
    try {
        const answer = await answerService.create(req.body);
        res.status(201).json(answer);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao criar resposta' });
    }
};

export const updateAnswer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const answer = await answerService.update(id, req.body);
        res.json(answer);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao atualizar resposta' });
    }
};

export const deleteAnswer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await answerService.delete(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao deletar resposta' });
    }
};

export const getAnswerById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const answer = await answerService.findById(id);
        res.json(answer);
    } catch (error: any) {
        res.status(404).json({ error: error.message || 'Resposta não encontrada' });
    }
};