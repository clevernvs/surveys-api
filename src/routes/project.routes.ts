import { Router } from 'express';
import { getAllProjects, createProject } from '../controllers/project.controller';

const router = Router();

router.get('/projects', getAllProjects);
router.post('/projects', createProject);

export default router;