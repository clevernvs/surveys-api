import { Request, Response } from 'express';
import { QuestionnaireService } from '../services/questionnaire.service';
import prisma from '../prisma/client';

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

export const createTestData = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log('Criando dados de teste...');

        // Criar empresa
        const company = await prisma.company.create({
            data: {
                name: 'Empresa Teste'
            }
        });
        console.log('Empresa criada:', company);

        // Criar projeto
        const project = await prisma.project.create({
            data: {
                title: 'Projeto Teste',
                description: 'Descrição do projeto teste',
                project_type_id: 1,
                language_id: 1,
                category_id: 1,
                sample_source_id: 1,
                community_id: 1,
                status_id: 1,
                sample_size: 100,
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
                company_id: company.id
            }
        });
        console.log('Projeto criado:', project);

        // Criar questionário
        const questionnaire = await prisma.questionnaire.create({
            data: {
                title: 'Questionário de Teste',
                filter_id: 1,
                randomized_answers: false,
                status_id: 1,
                project_id: project.id
            }
        });
        console.log('Questionário criado:', questionnaire);

        res.json({
            success: true,
            data: {
                company,
                project,
                questionnaire
            },
            message: 'Dados de teste criados com sucesso'
        });
    } catch (error) {
        console.error('Erro ao criar dados de teste:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};