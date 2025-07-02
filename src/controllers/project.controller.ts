import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export const getAllProjects = async (_req: Request, res: Response) => {
    try {
        const projects = await projectService.findAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
    const {
        title,
        description,
        project_type_id,
        language_id,
        category_id,
        sample_source_id,
        community_id,
        status,
        sample_size,
        start_date,
        end_date,
        company_id
    } = req.body;

    // Validação simples dos campos obrigatórios
    if (!title || !description || !project_type_id || !language_id || !category_id || !sample_source_id || !community_id || !status || !sample_size || !start_date || !end_date || !company_id) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
    }

    try {
        const project = await projectService.create({
            title,
            description,
            project_type_id,
            language_id,
            category_id,
            sample_source_id,
            community_id,
            status,
            sample_size,
            start_date,
            end_date,
            company_id
        });
        res.status(201).json(project);
    } catch (error: any) {
        console.error('Erro detalhado:', error);
        res.status(500).json({
            error: 'Erro ao criar projeto',
            details: error.message || 'Erro desconhecido'
        });
    }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
        title,
        description,
        project_type_id,
        language_id,
        category_id,
        sample_source_id,
        community_id,
        status,
        sample_size,
        start_date,
        end_date,
        company_id
    } = req.body;

    // Validação simples dos campos obrigatórios
    if (!title || !description || !project_type_id || !language_id || !category_id || !sample_source_id || !community_id || !status || !sample_size || !start_date || !end_date || !company_id) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
    }

    try {
        const project = await projectService.update(Number(id), {
            title,
            description,
            project_type_id,
            language_id,
            category_id,
            sample_source_id,
            community_id,
            status,
            sample_size,
            start_date,
            end_date,
            company_id
        });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar projeto' });
    }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await projectService.delete(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar projeto' });
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