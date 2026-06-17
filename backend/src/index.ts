import { createApp } from './app.js';
import { config } from './config.js';
import { query } from './db/pool.js';

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  due_date DATE,
  scheduled_date DATE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
  committed_to_today BOOLEAN NOT NULL DEFAULT false,
  priority VARCHAR(16) NOT NULL DEFAULT 'none'
);
`;

async function start() {
  await query(MIGRATION_SQL);

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
