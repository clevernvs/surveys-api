import { Router } from 'express';
import { getAllProjects, createProject, updateProject, deleteProject, getProjectById } from '../controllers/project.controller';

const router = Router();

router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;