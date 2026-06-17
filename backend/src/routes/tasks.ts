import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import * as todoService from '../services/todoService.js';

const router = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(500),
  notes: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  scheduledDate: z.string().optional(),
  committedToToday: z.boolean().optional(),
  priority: z.enum(['none', 'high', 'medium', 'low']).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(500).optional(),
  notes: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  completedAt: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  committedToToday: z.boolean().optional(),
  priority: z.enum(['none', 'high', 'medium', 'low']).optional(),
});

function createId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

router.get('/', async (_req, res, next) => {
  try {
    const tasks = await todoService.listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
    }
    const task = await todoService.createTask({
      id: createId(),
      ...parsed.data,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors[0]?.message ?? 'Invalid request');
    }
    const task = await todoService.updateTask(req.params.id, parsed.data);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await todoService.deleteTask(req.params.id);
    if (!deleted) {
      throw new AppError(404, 'Task not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
