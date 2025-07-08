import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema';

const projectService = new ProjectService();

export const getAllProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await projectService.findAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const project = await projectService.findById(Number(id));

        if (!project) {
            res.status(404).json({ error: 'Projeto não encontrado' });
            return;
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projeto' });
    }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.body já está validado pelo middleware Zod
        const projectData: CreateProjectInput = req.body;
        const project = await projectService.create(projectData);
        res.status(201).json(project);
    } catch (error: any) {
        res.status(500).json({
            error: 'Erro ao criar projeto',
            details: error.message || 'Erro desconhecido'
        });
    }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        // req.body já está validado pelo middleware Zod
        const projectData: UpdateProjectInput = req.body;
        const project = await projectService.update(Number(id), projectData);
        res.status(200).json(project);
    } catch (error: any) {
        // Tratamento específico de erros
        if (error.message === 'Projeto não encontrado') {
            res.status(404).json({ error: 'Projeto não encontrado' });
            return;
        }

        if (error.message === 'Cliente não encontrado') {
            res.status(400).json({ error: 'Cliente não encontrado' });
            return;
        }

        res.status(500).json({
            error: 'Erro ao atualizar projeto',
            details: error.message || 'Erro desconhecido'
        });
    }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await projectService.delete(Number(id));
        res.status(204).send();
    } catch (error: any) {
        // Tratamento específico de erros
        if (error.message === 'Projeto não encontrado') {
            res.status(404).json({ error: 'Projeto não encontrado' });
            return;
        }

        if (error.message.includes('relacionamentos ativos')) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(500).json({
            error: 'Erro ao deletar projeto',
            details: error.message || 'Erro desconhecido'
        });
    }
};