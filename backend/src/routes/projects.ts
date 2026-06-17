import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import * as todoService from '../services/todoService.js';

const router = Router();

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(255),
  color: z.string().min(1).max(32),
});

function createId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

router.get('/', async (_req, res, next) => {
  try {
    const projects = await todoService.listProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
    }
    const project = await todoService.createProject({
      id: createId(),
      ...parsed.data,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await todoService.deleteProject(req.params.id);
    if (!deleted) {
      throw new AppError(404, 'Project not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
