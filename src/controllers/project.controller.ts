import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.findAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};