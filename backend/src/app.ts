import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import tasksRouter from './routes/tasks.js';
import projectsRouter from './routes/projects.js';
import { pool } from './db/pool.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigins.includes('*') ? true : config.corsOrigins,
    }),
  );
  app.use(express.json());

  app.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'degraded' });
    }
  });

  app.use('/api/tasks', tasksRouter);
  app.use('/api/projects', projectsRouter);

  app.use(errorHandler);

  return app;
}
