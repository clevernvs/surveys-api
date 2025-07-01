import { Router } from 'express';
import { getAllProjects, createProject, updateProject } from '../controllers/project.controller';

const router = Router();

router.get('/projects', getAllProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);

export default router;