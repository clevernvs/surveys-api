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

export const createProject = async (req: Request, res: Response) => {
    const {
        title,
        description,
        type_id,
        language_id,
        category_id,
        sample_source_id,
        community_id,
        status,
        sample_size,
        start_date,
        end_date
    } = req.body;

    // Validação simples dos campos obrigatórios
    if (!title || !description || !type_id || !language_id || !category_id || !sample_source_id || !community_id || !status || !sample_size || !start_date || !end_date) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        const project = await projectService.create({
            title,
            description,
            type_id,
            language_id,
            category_id,
            sample_source_id,
            community_id,
            status,
            sample_size,
            start_date,
            end_date
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
};