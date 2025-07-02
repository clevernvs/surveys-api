import { Router } from 'express';
import { getAllProjects, createProject, updateProject, deleteProject, getProjectById } from '../controllers/project.controller';
import { validateZod, validateParams } from '../middleware/zod-validation.middleware';
import { CreateProjectSchema, UpdateProjectSchema, ProjectIdSchema } from '../schemas/project.schema';

const router = Router();

router.get('/projects', getAllProjects);
router.get('/projects/:id', validateParams(ProjectIdSchema), getProjectById);
router.post('/projects', validateZod(CreateProjectSchema), createProject);
router.put('/projects/:id', validateParams(ProjectIdSchema), validateZod(UpdateProjectSchema), updateProject);
router.delete('/projects/:id', validateParams(ProjectIdSchema), deleteProject);

export default router;